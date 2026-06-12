import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.production';

interface Document {
  id: number;
  title: string;
  author: string;
  relevanceScore: number;
}

@Component({
  selector: 'app-algorithm-race',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, TranslateModule],
  templateUrl: './algorithm-race.component.html',
  styleUrl: './algorithm-race.component.css'
})
export class AlgorithmRaceComponent implements OnInit, OnDestroy {
  elementCount = 50;
  elementsHintText = 'Number of elements to sort (5-1000)';
  bubbleArray = signal<number[]>([]);
  quickArray = signal<number[]>([]);
  bubbleTime = signal(0);
  quickTime = signal(0);
  bubbleFinished = signal(false);
  quickFinished = signal(false);
  winner = signal<'bubble' | 'quick' | null>(null);
  isRunning = signal(false);
  bubbleSortedIndices = signal<number[]>([]);
  quickSortedIndices = signal<number[]>([]);
  bubbleGlowIndex = signal(0);
  quickGlowIndex = signal(0);
  bubbleLoserGlowIndex = signal(0);
  quickLoserGlowIndex = signal(0);

  private bubbleSubscription?: Subscription;
  private quickSubscription?: Subscription;
  private quickSortTimeout?: ReturnType<typeof setTimeout>;
  private bubbleInterval = 100;
  private quickInterval = 20;
  private bubbleIndex = 0;
  private quickIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRaceData();
  }

  ngOnDestroy(): void {
    this.stopRace();
  }

  onElementCountChange(): void {
    if (!this.isRunning()) {
      this.fetchRaceData();
    }
  }

  private getSortedIndices(arr: number[]): number[] {
    const indexed = arr.map((value, index) => ({ value, index }));
    indexed.sort((a, b) => a.value - b.value);
    return indexed.map(item => item.index);
  }

  isSortedIndex(sortedIndices: number[], index: number): boolean {
    return sortedIndices.includes(index);
  }

  isGlowIndex(glowIndex: number, sortedIndices: number[], index: number): boolean {
    if (glowIndex === 0) return false;
    const sorted = sortedIndices.slice(0, glowIndex);
    return sorted.includes(index);
  }

  isLoserGlowIndex(glowIndex: number, sortedIndices: number[], index: number): boolean {
    if (glowIndex === 0) return false;
    const sorted = sortedIndices.slice(0, glowIndex);
    return sorted.includes(index);
  }

  private startGlowAnimation(sortedIndices: number[], isBubble: boolean): void {
    const animate = (current: number) => {
      if (isBubble) {
        this.bubbleGlowIndex.set(current);
      } else {
        this.quickGlowIndex.set(current);
      }
      
      if (current < sortedIndices.length) {
        setTimeout(() => animate(current + 1), 50/current*2);
      }
    };
    animate(1);
  }

  private startLoserGlowAnimation(sortedIndices: number[], isBubble: boolean): void {
    const animate = (current: number) => {
      if (isBubble) {
        this.bubbleLoserGlowIndex.set(current);
      } else {
        this.quickLoserGlowIndex.set(current);
      }
      
      if (current < sortedIndices.length) {
        setTimeout(() => animate(current + 1), (50 / current) * 2);
      }
    };
    animate(1);
  }

  fetchRaceData(): void {
    const count = Math.max(5, Math.min(1000, this.elementCount || 50));
    this.http.get<Document[]>(`${environment.apiUrl}/api/documents/race-data?count=${count}`).subscribe({
      next: (docs) => {
        const scores = docs.map(d => d.relevanceScore);
        this.bubbleArray.set([...scores]);
        this.quickArray.set([...scores]);
      },
      error: (err) => console.error('Error fetching race data:', err)
    });
  }

  startRace(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.bubbleFinished.set(false);
    this.quickFinished.set(false);
    this.winner.set(null);
    this.bubbleTime.set(0);
    this.quickTime.set(0);
    this.bubbleIndex = 0;
    this.quickIndex = 0;
    this.bubbleSortedIndices.set([]);
    this.quickSortedIndices.set([]);
    this.bubbleGlowIndex.set(0);
    this.quickGlowIndex.set(0);
    this.bubbleLoserGlowIndex.set(0);
    this.quickLoserGlowIndex.set(0);

    this.fetchRaceData();

    setTimeout(() => {
      this.startBubbleSort();
      this.startQuickSort();
    }, 500);
  }

  startBubbleSort(): void {
    const arr = [...this.bubbleArray()];
    const n = arr.length;

    this.bubbleSubscription = interval(this.bubbleInterval).subscribe(() => {
      if (this.bubbleIndex < n - 1) {
        let swapped = false;
        for (let j = 0; j < n - this.bubbleIndex - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swapped = true;
          }
        }
        this.bubbleArray.set([...arr]);
        this.bubbleTime.update(t => t + this.bubbleInterval / 1000);
        this.bubbleIndex++;
      } else {
        this.bubbleSubscription?.unsubscribe();
        this.bubbleFinished.set(true);
        const sortedIndices = this.getSortedIndices(this.bubbleArray());
        this.bubbleSortedIndices.set(sortedIndices);
        this.startGlowAnimation(sortedIndices, true);
        this.checkWinner();
      }
    });
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  startQuickSort(): void {
    const arr = [...this.quickArray()];
    const n = arr.length;
    let low = 0;
    let high = n - 1;
    let pi: number | null = null;
    const stack: { low: number; high: number }[] = [{ low, high }];

    const runQuickSortStep = () => {
      if (stack.length === 0) {
        this.quickFinished.set(true);
        const sortedIndices = this.getSortedIndices(this.quickArray());
        this.quickSortedIndices.set(sortedIndices);
        this.startGlowAnimation(sortedIndices, false);
        this.checkWinner();
        return;
      }

      const current = stack[stack.length - 1];
      low = current.low;
      high = current.high;

      if (low < high) {
        if (pi === null) {
          pi = this.partition(arr, low, high);
          this.quickArray.set([...arr]);
          this.quickTime.update(t => t + this.quickInterval / 1000);
          
          stack.pop();
          if (pi + 1 < high) {
            stack.push({ low: pi + 1, high });
          }
          if (low < pi - 1) {
            stack.push({ low, high: pi - 1 });
          }
          pi = null;
        }
      } else {
        stack.pop();
      }

      if (stack.length > 0) {
        this.quickSortTimeout = setTimeout(() => runQuickSortStep(), this.quickInterval);
      } else {
        this.quickFinished.set(true);
        const sortedIndices = this.getSortedIndices(this.quickArray());
        this.quickSortedIndices.set(sortedIndices);
        this.startGlowAnimation(sortedIndices, false);
        this.checkWinner();
      }
    };

    runQuickSortStep();
  }

  stopRace(): void {
    this.bubbleSubscription?.unsubscribe();
    this.isRunning.set(false);
    this.quickSubscription?.unsubscribe();
    if (this.quickSortTimeout) {
      clearTimeout(this.quickSortTimeout);
      this.quickSortTimeout = undefined;
    }
  }

  checkWinner(): void {
    if (this.bubbleFinished() && this.quickFinished()) {
      if (this.bubbleTime() < this.quickTime()) {
        this.winner.set('bubble');
        this.startLoserGlowAnimation(this.quickSortedIndices(), false);
      } else {
        this.winner.set('quick');
        this.startLoserGlowAnimation(this.bubbleSortedIndices(), true);
      }
      this.stopRace();
    }
  }

  reset(): void {
    this.stopRace();
    this.bubbleTime.set(0);
    this.quickTime.set(0);
    this.bubbleFinished.set(false);
    this.quickFinished.set(false);
    this.winner.set(null);
    this.bubbleSortedIndices.set([]);
    this.quickSortedIndices.set([]);
    this.bubbleGlowIndex.set(0);
    this.quickGlowIndex.set(0);
    this.bubbleLoserGlowIndex.set(0);
    this.quickLoserGlowIndex.set(0);
    this.fetchRaceData();
  }
}
