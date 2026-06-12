import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { VisualizationService } from '../../../core/services/visualization.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSliderModule, FormsModule, TranslateModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css',
})
export class ControlPanelComponent {
  private visualizationService = inject(VisualizationService);
  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {}

  // Direct signal access
  currentStep = this.visualizationService.currentStep;
  totalSteps = this.visualizationService.totalSteps;
  isPlaying = this.visualizationService.isPlaying;
  speed = this.visualizationService.speed;

  // Computed signals for button states from service
  canGoNext = this.visualizationService.canGoNext;
  canGoPrev = this.visualizationService.canGoPrev;

  // Speed multiplier for slider (1-5) - make it a signal for reactivity
  speedMultiplier = signal(1);

  // Collapse state
  isCollapsed = signal(false);

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  play(): void {
    this.visualizationService.play();
  }

  pause(): void {
    this.visualizationService.pause();
  }

  nextStep(): void {
    this.visualizationService.nextStep();
  }

  previousStep(): void {
    this.visualizationService.previousStep();
  }

  reset(): void {
    this.visualizationService.reset();
  }

  onSpeedChange(value: number): void {
    this.speedMultiplier.set(value);
    // Convert multiplier to milliseconds: 1x = 500ms, 2x = 250ms, 3x = 166ms, 4x = 125ms, 5x = 100ms
    let speedMs = 500 / value;
    switch (value) {
      case 1:
        speedMs = 500;
        break;
      case 2:
        speedMs = 250;
        break;
      case 3:
        speedMs = 125;
        break;
      case 4:
        speedMs = 50;
        break;
      case 5:
        speedMs = 1;
        break;
      default:
        speedMs = 500;
    }
    this.visualizationService.setSpeed(speedMs);
  }

  get stepCounter(): string {
    const current = this.currentStep() + (this.totalSteps() > 0 ? 1 : 0);
    const total = this.totalSteps();
    const stepLabel = this.translate.instant('CONTROL_PANEL.STEP');

    if (this.languageService.isArabic) {
      return `${total} \\ ${current} :${stepLabel}`;
    }
    else{
      return `${stepLabel}: ${current} / ${total}`;
    }
  }

  formatLabel(value: number): string {
    return `${value}x`;
  }

  currentColor(): string {
    switch (this.speedMultiplier()) {
      case 1:
        return '#58a6ff'; // speed 1 col
      case 2:
        return '#3382f9'; // speed 2 col
      case 3:
        return '#1f6feb'; // speed 3 col
      case 4:
        return '#155ecb'; // speed 4 col
      case 5:
        return '#0543a1'; // speed 5 col
      default:
        return '#58a6ff';
    }
  }
}
