import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { VisualizationStep } from '../../shared/models/visualization-step.model';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  // Signals
  currentStep = signal<number>(0);
  totalSteps = signal<number>(0);
  isPlaying = signal<boolean>(false);
  speed = signal<number>(500); // milliseconds
  visualizationSteps = signal<VisualizationStep[]>([]);

  // Computed signal
  currentStepData = computed(() => {
    const steps = this.visualizationSteps();
    const step = this.currentStep();
    return steps[step] || null;
  });

  // Computed signals for navigation buttons
  canGoPrev = computed(() => this.currentStep() > 0);
  canGoNext = computed(() => this.currentStep() < this.totalSteps() - 1);

  // Observer Pattern: BehaviorSubject for control panel state changes
  private controlPanelState$ = new BehaviorSubject<{
    isPlaying: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
  }>({
    isPlaying: false,
    currentStep: 0,
    totalSteps: 0,
    speed: 500
  });

  private playInterval: Subscription | null = null;

  constructor() {
    // Sync signals with BehaviorSubject using effect
    effect(() => {
      const isPlaying = this.isPlaying();
      const state = this.controlPanelState$.value;
      this.controlPanelState$.next({ ...state, isPlaying });
    });

    effect(() => {
      const currentStep = this.currentStep();
      const state = this.controlPanelState$.value;
      this.controlPanelState$.next({ ...state, currentStep });
    });

    effect(() => {
      const totalSteps = this.totalSteps();
      const state = this.controlPanelState$.value;
      this.controlPanelState$.next({ ...state, totalSteps });
    });

    effect(() => {
      const speed = this.speed();
      const state = this.controlPanelState$.value;
      this.controlPanelState$.next({ ...state, speed });
    });
  }

  // Observable for components that need to observe state changes
  getControlPanelState$(): Observable<{ isPlaying: boolean; currentStep: number; totalSteps: number; speed: number }> {
    return this.controlPanelState$.asObservable();
  }

  // Load visualization steps
  loadSteps(steps: VisualizationStep[]): void {
    this.pause();
    this.visualizationSteps.set(steps);
    this.totalSteps.set(steps.length);
    this.currentStep.set(0);
  }

  // Play animation
  play(): void {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);
    this.startAutoPlay();
  }

  // Pause animation
  pause(): void {
    this.isPlaying.set(false);
    this.stopAutoPlay();
  }

  // Go to next step
  nextStep(): void {
    const current = this.currentStep();
    const total = this.totalSteps();
    if (current < total - 1) {
      this.currentStep.set(current + 1);
    }
  }

  // Go to previous step
  previousStep(): void {
    const current = this.currentStep();
    if (current > 0) {
      this.currentStep.set(current - 1);
    }
  }

  // Reset to first step
  reset(): void {
    this.pause();
    this.currentStep.set(0);
  }

  // Set animation speed
  setSpeed(speed: number): void {
    this.speed.set(speed);
    // If currently playing, restart with new speed
    if (this.isPlaying()) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  // Go to specific step
  goToStep(index: number): void {
    const total = this.totalSteps();
    if (index >= 0 && index < total) {
      this.pause();
      this.currentStep.set(index);
    }
  }

  // Private method to start auto-play
  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.playInterval = interval(this.speed()).subscribe(() => {
      const current = this.currentStep();
      const total = this.totalSteps();
      if (current < total - 1) {
        this.currentStep.set(current + 1);
      } else {
        this.pause();
      }
    });
  }

  // Private method to stop auto-play
  private stopAutoPlay(): void {
    if (this.playInterval) {
      this.playInterval.unsubscribe();
      this.playInterval = null;
    }
  }

  // Cleanup on destroy
  ngOnDestroy(): void {
    this.stopAutoPlay();
  }
}
