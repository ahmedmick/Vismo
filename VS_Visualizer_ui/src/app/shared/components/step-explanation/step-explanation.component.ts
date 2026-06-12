import { Component, inject } from '@angular/core';
import { VisualizationService } from '../../../core/services/visualization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-explanation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-explanation.component.html',
  styleUrl: './step-explanation.component.css'
})
export class StepExplanationComponent {
  private visualizationService = inject(VisualizationService);

  currentStepData = this.visualizationService.currentStepData;
  currentStep = this.visualizationService.currentStep;
  totalSteps = this.visualizationService.totalSteps;

  get description(): string {
    return this.currentStepData()?.description || '';
  }

  get formattedDescription(): string {
    let text = this.description;
    
    // Split found value line from complexity explanation
    if (text.includes('Found value:')) {
      const parts = text.split('Found value:');
      if (parts.length >= 2) {
        const foundLine = parts[0].trim() + 'Found value:' + parts[1].split('\n')[0];
        const complexityPart = parts[1].split('\n').slice(1).join('\n').trim();
        text = foundLine + '\n\n' + complexityPart;
      }
    }
    
    // Color key terms - use word boundaries to prevent double replacement
    text = text.replace(/\b(Formula)\b:/gi, '<span class="formula">$1</span>:');
    text = text.replace(/\b(Base address)\b:/gi, '<span class="base">$1</span>:');
    text = text.replace(/\b(base_address)\b/gi, '<span class="base">$1</span>');
    text = text.replace(/\b(Index)\b/gi, '<span class="index">$1</span>');
    text = text.replace(/\b(bytes)\b/gi, '<span class="bytes">$1</span>');
    text = text.replace(/\b(elements)\b/gi, '<span class="result">$1</span>');
    text = text.replace(/(0x[0-9A-F]+)/gi, '<span class="result">$1</span>');
    
    return text;
  }

  get resultState(): 'not-found' | 'found' | 'default' {
    const desc = this.description.toLowerCase();
    if (desc.includes('not found')) return 'not-found';
    if (desc.includes('found') && !desc.includes('not found')) return 'found';
    return 'default';
  }

  get isLastStep(): boolean {
    return this.currentStep() === this.totalSteps() - 1;
  }
}
