import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { environment } from '../../../../environments/environment.production';

interface Document {
  id: number;
  title: string;
  author: string;
  relevanceScore: number;
}

interface LeaderboardEntry {
  id: number;
  playerName: string;
  timeToSort: number;
  swapCount: number;
  wonAgainstAI: boolean;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  hoveredRowId = signal<number | null>(null);
  userDocuments = signal<Document[]>([]);
  aiDocuments = signal<Document[]>([]);
  selectedIndices = signal<[number, number] | null>(null);
  userSwapCount = signal(0);
  userTime = signal(0);
  aiSwapCount = signal(0);
  aiTime = signal(0);
  isUserComplete = signal(false);
  isAIComplete = signal(false);
  gameStarted = signal(false);
  gameOver = signal(false);
  userWon = signal(false);
  playerName = '';
  leaderboard = signal<LeaderboardEntry[]>([]);

  @ViewChild('fireworksCanvas') fireworksCanvas!: ElementRef<HTMLCanvasElement>;

  private fireworksAnimationId: number = 0;

  difficulty = signal<'easy' | 'medium' | 'hard'>('easy');
  difficultyIntervals = { easy: 800, medium: 500, hard: 200 };
  difficultyGlowColors = { easy: 'green', medium: 'orange', hard: 'red' };

  private timerSubscription?: Subscription;
  private aiTimerSubscription?: Subscription;
  private aiIntervalSubscription?: Subscription;
  private aiCurrentIndex = 0;
  private originalDocuments: Document[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGameData();
    this.fetchLeaderboard();
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }

  fetchGameData(): void {
    this.http.get<Document[]>(`${environment.apiUrl}/documents/game-data`).subscribe({
      next: (docs) => {
        this.originalDocuments = JSON.parse(JSON.stringify(docs));
        this.userDocuments.set(docs);
        this.aiDocuments.set([...docs]);
        this.resetGame();
      },
      error: (err) => console.error('Error fetching game data:', err),
    });
  }

  fetchLeaderboard(): void {
    this.http.get<LeaderboardEntry[]>(`${environment.apiUrl}/leaderboard`).subscribe({
      next: (entries) => this.leaderboard.set(entries),
      error: (err) => console.error('Error fetching leaderboard:', err),
    });
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty.set(level);
  }

  clearLeaderboard(): void {
    this.http.delete(`${environment.apiUrl}/leaderboard`).subscribe({
      next: () => this.leaderboard.set([]),
      error: (err) => console.error('Error clearing leaderboard:', err),
    });
  }

  deleteEntry(id: number): void {
    this.http.delete(`${environment.apiUrl}/leaderboard/${id}`).subscribe({
      next: () => this.fetchLeaderboard(),
      error: (err) => console.error('Error deleting entry:', err),
    });
  }

  resetGame(): void {
    this.stopTimers();
    if (this.originalDocuments.length > 0) {
      this.userDocuments.set(JSON.parse(JSON.stringify(this.originalDocuments)));
      this.aiDocuments.set(JSON.parse(JSON.stringify(this.originalDocuments)));
    }
    this.userSwapCount.set(0);
    this.aiSwapCount.set(0);
    this.userTime.set(0);
    this.aiTime.set(0);
    this.isUserComplete.set(false);
    this.isAIComplete.set(false);
    this.gameStarted.set(false);
    this.gameOver.set(false);
    this.userWon.set(false);
    this.selectedIndices.set(null);
    this.aiCurrentIndex = 0;
  }

  startGame(): void {
    this.gameStarted.set(true);
    this.startUserTimer();
    this.startAITimer();
  }

  startUserTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.userTime.update((t) => t + 1);
    });
  }

  startAITimer(): void {
    const intervalMs = this.difficultyIntervals[this.difficulty()];
    this.aiIntervalSubscription = interval(intervalMs).subscribe(() => {
      this.performAISwap();
    });
    // Also start AI time counter
    this.aiTimerSubscription = interval(1000).subscribe(() => {
      this.aiTime.update((t) => t + 1);
    });
  }

  stopTimers(): void {
    this.timerSubscription?.unsubscribe();
    this.aiTimerSubscription?.unsubscribe();
    this.aiIntervalSubscription?.unsubscribe();
  }

  selectCard(index: number): void {
    if (!this.gameStarted() || this.isUserComplete() || this.gameOver()) return;

    const selected = this.selectedIndices();

    if (selected === null) {
      this.selectedIndices.set([index, -1]);
    } else if (selected[1] === -1) {
      if (selected[0] !== index) {
        this.swapUserCards(selected[0], index);
      }
      this.selectedIndices.set(null);
    }
  }

  swapUserCards(i: number, j: number): void {
    const docs = [...this.userDocuments()];
    const temp = docs[i];
    docs[i] = docs[j];
    docs[j] = temp;
    this.userDocuments.set(docs);
    this.userSwapCount.update((c) => c + 1);

    if (this.isSorted(docs)) {
      this.isUserComplete.set(true);
      this.checkGameOver();
    }
  }

  performAISwap(): void {
    const docs = [...this.aiDocuments()];
    const n = docs.length;

    // Continue until sorted (not just one pass)
    if (!this.isSorted(docs)) {
      const j = this.aiCurrentIndex;
      if (j < n - 1 && docs[j].relevanceScore > docs[j + 1].relevanceScore) {
        const temp = docs[j];
        docs[j] = docs[j + 1];
        docs[j + 1] = temp;
        this.aiSwapCount.update((c) => c + 1);
        this.aiDocuments.set(docs);
      }
      // Move to next index, wrap around for next pass
      this.aiCurrentIndex = (this.aiCurrentIndex + 1) % (n - 1);

      if (this.isSorted(docs)) {
        this.isAIComplete.set(true);
        this.checkGameOver();
      }
    } else {
      this.isAIComplete.set(true);
      this.checkGameOver();
    }
  }

  isSorted(docs: Document[]): boolean {
    for (let i = 0; i < docs.length - 1; i++) {
      if (docs[i].relevanceScore > docs[i + 1].relevanceScore) {
        return false;
      }
    }
    return true;
  }

  checkGameOver(): void {
    if (this.isUserComplete() || this.isAIComplete()) {
      this.stopTimers();
      this.gameOver.set(true);
      const won = this.isUserComplete() && !this.isAIComplete();
      this.userWon.set(won);
      
      if (won) {
        setTimeout(() => {
          this.startCelebration();
        }, 200);
      }
    }
  }

  saveResult(): void {
    const entry = {
      playerName: this.playerName || 'Anonymous',
      timeToSort: this.userTime(),
      swapCount: this.userSwapCount(),
      wonAgainstAI: this.userWon(),
    };

    this.http.post<LeaderboardEntry>(`${environment.apiUrl}/leaderboard`, entry).subscribe({
      next: () => {
        this.fetchLeaderboard();
        this.stopCelebration();
        this.gameOver.set(false);
        this.userWon.set(false);
      },
      error: (err) => console.error('Error saving result:', err),
    });
  }

  dragStartIndex = signal<number | null>(null);
  dragStartX = signal(0);
  dragOverIndex = signal<number | null>(null);
  dragOffset = signal(0); // pixels shifted during drag

  onDragStart(event: DragEvent, index: number): void {
    if (!this.gameStarted() || this.gameOver()) {
      event.preventDefault();
      return;
    }
    this.dragStartIndex.set(index);
    this.dragStartX.set(event.clientX);
    (event.target as HTMLElement).classList.add('dragging');
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (!this.gameStarted() || this.gameOver()) return;

    const sourceIndex = this.dragStartIndex();
    if (sourceIndex === null) return;

    let offsetX = event.clientX - this.dragStartX();
    const barWidth = 40;
    const gap = 8;
    const totalWidth = barWidth + gap;

    // Clamp offset to not go past neighbor bar
    // const maxRight = totalWidth;
    // const maxLeft = -totalWidth;
    // offsetX = Math.max(maxLeft, Math.min(offsetX, maxRight));

    this.dragOffset.set(offsetX);

    if (index !== sourceIndex) {
      this.dragOverIndex.set(index);
    }
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    if (!this.gameStarted() || this.gameOver()) return;

    const sourceIndex = this.dragStartIndex();
    const offset = this.dragOffset();
    const barWidth = 40;
    const gap = 8;
    const threshold = (barWidth + gap) * 0.5;

    if (sourceIndex === null) return;

    // Calculate target based on direction
    const direction = offset >= 0 ? 1 : -1;
    const targetIndex = sourceIndex + direction;
    const maxIndex = this.userDocuments().length - 1;

    // Only swap if dragged past threshold and target is valid
    if (Math.abs(offset) >= threshold && targetIndex >= 0 && targetIndex <= maxIndex) {
      // Add bounds checking for turns
      const maxSwapsRight = maxIndex - sourceIndex;
      const maxSwapsLeft = sourceIndex;
      const maxSwaps = direction === 1 ? maxSwapsRight : maxSwapsLeft;
      const turns = Math.min(Math.abs(Math.round(offset / 48)), maxSwaps);

      for (let i = 0; i < Math.abs(turns); i++) {
        if (direction == 1) {
          this.swapUserCards(sourceIndex + i, targetIndex + i);
        } else {
          this.swapUserCards(sourceIndex - i, targetIndex - i);
        }
      }
    }

    // Reset drag state
    this.onDragEnd();
  }

  onDragEnd(): void {
    // Temporarily disable transition to prevent fast animation
    const bars = document.querySelectorAll('.bar-wrapper');
    bars.forEach((bar) => ((bar as HTMLElement).style.transition = 'none'));

    this.dragStartIndex.set(null);
    this.dragStartX.set(0);
    this.dragOverIndex.set(null);
    this.dragOffset.set(0);

    // Re-enable transition after a frame
    requestAnimationFrame(() => {
      bars.forEach((bar) => ((bar as HTMLElement).style.transition = ''));
    });
  }

  getDragTransform(index: number): string {
    const sourceIndex = this.dragStartIndex();
    const offset = this.dragOffset();

    // Minimum movement threshold
    if (sourceIndex === null || Math.abs(offset) < 5) {
      return '';
    }

    const barWidth = 40;
    const gap = 8;
    const totalWidth = barWidth + gap;
    const draggingRight = offset > 0;
    const draggingLeft = offset < 0;
    const barsPassed = Math.floor(Math.abs(offset) / totalWidth);

    // Source bar follows the drag
    if (index === sourceIndex) {
      return `translateX(${offset}px)`;
    }

    // Calculate progress within current bar position
    const progress = (Math.abs(offset) % totalWidth) / totalWidth;

    // If dragging right, bars to the right move left
    if (draggingRight && index > sourceIndex && index <= sourceIndex + barsPassed + 1) {
      const positionFromSource = index - sourceIndex;
      let barProgress = progress;
      if (positionFromSource <= barsPassed) {
        barProgress = 1;
      }
      return `translateX(${-totalWidth * barProgress}px)`;
    }

    // If dragging left, bars to the left move right
    if (draggingLeft && index < sourceIndex && index >= sourceIndex - barsPassed - 1) {
      const positionFromSource = sourceIndex - index;
      let barProgress = progress;
      if (positionFromSource <= barsPassed) {
        barProgress = 1;
      }
      return `translateX(${totalWidth * barProgress}px)`;
    }

    return '';
  }

  startCelebration(): void {
    setTimeout(() => {
      this.startFireworks();
      
      setTimeout(() => {
        this.stopCelebration();
      }, 5000);
    }, 100);
  }

  stopCelebration(): void {
    cancelAnimationFrame(this.fireworksAnimationId);
  }

  startFireworks(): void {
    const canvas = this.fireworksCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
      trail: { x: number; y: number }[];
    }

    const fireworkParticles: FireworkParticle[] = [];

    const colors = ['#58a6ff', '#3fb950', '#e3b341', '#bc8cff', '#f0883e', '#ff6b9d'];

    const explode = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 60 + Math.random() * 40;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        fireworkParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          size: 2 + Math.random() * 3,
          trail: [],
        });
      }
    };

    let launchCount = 0;
    const launchInterval = setInterval(() => {
      const x = 100 + Math.random() * (canvas.width - 200);
      const y = 50 + Math.random() * (canvas.height * 0.5);
      explode(x, y);
      launchCount++;
      if (launchCount >= 12) {
        clearInterval(launchInterval);
      }
    }, 400);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const p = fireworkParticles[i];

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) {
          p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.99;
        p.life -= 1 / p.maxLife;

        p.trail.forEach((point, idx) => {
          const trailOpacity = (idx / p.trail.length) * p.life * 0.5;
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          fireworkParticles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      this.fireworksAnimationId = requestAnimationFrame(animate);
    };

    animate();
  }
}
