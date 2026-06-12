import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, AlgorithmResponse } from '../../../../core/services/api.service';
import { VisualizationService } from '../../../../core/services/visualization.service';
import { ControlPanelComponent } from '../../../../shared/components/control-panel/control-panel.component';
import { StepExplanationComponent } from '../../../../shared/components/step-explanation/step-explanation.component';
import { CodePreviewComponent } from '../../../../shared/components/code-preview/code-preview.component';
import { DocumentSorterComponent } from '../../../../shared/components/document-sorter/document-sorter.component';
import { AlgorithmRaceComponent } from '../../../../shared/components/algorithm-race/algorithm-race.component';
import { DebuggerConsoleComponent } from '../../../../shared/components/debugger-console/debugger-console.component';
import { GameComponent } from '../../../../shared/components/game/game.component';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface TrackedElement {
  id: number;
  value: number;
  currentIndex: number;
  visualIndex: number;
}

@Component({
  selector: 'app-bubble-sort',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    TranslateModule,
    ControlPanelComponent,
    StepExplanationComponent,
    CodePreviewComponent,
    DocumentSorterComponent,
    AlgorithmRaceComponent,
    DebuggerConsoleComponent,
    GameComponent,
    MatTooltipModule,
    MatIconModule,
    ScrollingModule,
  ],
  templateUrl: './bubble-sort.component.html',
  styleUrl: './bubble-sort.component.css',
  providers: [VisualizationService],
})
export class BubbleSortComponent {
  private apiService = inject(ApiService);
  visualizationService = inject(VisualizationService);

  selectedTab = signal(0);

  hintText = [
    'Input format:',
    '• Comma-separated',
    '• 2 to 100 numbers only',
    '• Range of values:',
    '-1000000 to 1000000',
    '• Up to 5 decimal places',
  ].join('\n');

  generateCount: number = 10;
  decimalPlaces: number = 0;
  minValue: number = -1000;
  maxValue: number = 1000;

  countHintText = [
    '• Number of values to generate',
    '• Min: 2, Max: 100',
    '• Must be a positive integer',
  ].join('\n');

  decimalsHintText = [
    '• Decimal places for generated numbers',
    '• 0 = all integers',
    '• 1-5 = all decimals with exact number of decimal places',
    '• Min: 0, Max: 5',
  ].join('\n');

  minValueHintText = [
    '• Minimum value of generated numbers',
    '• Range: -1000000 to 1000000',
    '• Must be less than Max Value',
  ].join('\n');

  maxValueHintText = [
    '• Maximum value of generated numbers',
    '• Range: -1000000 to 1000000',
    '• Must be greater than Min Value',
  ].join('\n');

  arrayInput = '';
  isLoading = false;
  errorMessage = '';
  currentArray: number[] = [];

  // Element tracking for horizontal swap animation
  trackedElements: TrackedElement[] = [];
  private nextElementId = 0;
  swapAnimationDuration = 300; // ms
  private previousIndices: Map<number, number> = new Map(); // value -> previous index

  parseArray(input: string): number[] {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseFloat(s));
  }

  validateArray(arr: number[]): string | null {
    if (arr.length < 2 || arr.length > 100) return 'Array must have between 2 and 100 elements';

    for (const val of arr) {
      if (isNaN(val)) return 'Please enter valid numbers only';
      if (val < -1000000 || val > 1000000) return 'Values must be between -1000000 and 1000000';

      // Allow up to 5 decimal places only
      const decimalStr = val.toString().split('.')[1];
      if (decimalStr && decimalStr.length > 5) return 'Values can have up to 5 decimal places only';
    }
    return null; // valid
  }

  generateRandomArray(): void {
    // Validate Count
    if (
      !Number.isInteger(this.generateCount) ||
      this.generateCount < 2 ||
      this.generateCount > 100
    ) {
      this.errorMessage = 'Count must be an integer between 2 and 100';
      return;
    }

    // Validate Decimals
    if (!Number.isInteger(this.decimalPlaces) || this.decimalPlaces < 0 || this.decimalPlaces > 5) {
      this.errorMessage = 'Decimals must be an integer between 0 and 5';
      return;
    }

    // Validate Min Value
    if (this.minValue < -1000000 || this.minValue > 1000000) {
      this.errorMessage = 'Min Value must be between -1000000 and 1000000';
      return;
    }

    // Validate Max Value
    if (this.maxValue < -1000000 || this.maxValue > 1000000) {
      this.errorMessage = 'Max Value must be between -1000000 and 1000000';
      return;
    }

    // Validate Min <= Max
    if (this.minValue > this.maxValue) {
      this.errorMessage = 'Min Value must be less than or equal Max Value';
      return;
    }

    this.errorMessage = '';
    const range = this.maxValue - this.minValue;
    const arr: number[] = [];

    for (let i = 0; i < this.generateCount; i++) {
      const raw = Math.random() * range + this.minValue;

      if (this.decimalPlaces === 0) {
        // Integer: round to nearest integer
        arr.push(Math.round(raw));
      } else {
        // Decimal: fix to exact decimal places
        arr.push(parseFloat(raw.toFixed(this.decimalPlaces)));
      }
    }

    this.arrayInput = arr.join(', ');
    this.previewArray();
    this.updateBarLayout(arr);
  }

  previewArray(): void {
    const parsed = this.parseArray(this.arrayInput);
    const error = this.validateArray(parsed);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.errorMessage = '';
    this.currentArray = parsed;
    this.initTrackedElements(parsed);
    this.visualizationService.reset();
    this.visualizationService.loadSteps([]);
    this.updateBarLayout(parsed);
    this.runBubbleSort();
  }

  // Initialize tracked elements with unique IDs
  initTrackedElements(array: number[]): void {
    this.trackedElements = array.map((value, index) => ({
      id: this.nextElementId++,
      value,
      currentIndex: index,
      visualIndex: index,
    }));
  }

  // Get elements in display order (by current index)
  get displayElements(): TrackedElement[] {
    const stepData = this.visualizationService.currentStepData();
    const array = stepData?.currentArray || this.currentArray;

    if (stepData && this.trackedElements.length > 0) {
      // Map values back to tracked elements
      const result: TrackedElement[] = [];
      const valueToElement = new Map<number, TrackedElement>();

      // Create map of value -> tracked element (handle duplicates)
      this.trackedElements.forEach((el) => {
        const existing = valueToElement.get(el.value);
        if (!existing) {
          valueToElement.set(el.value, el);
        }
      });

      // Check if this is a swap step
      const swappedIndices = stepData.swappedIndices || [];
      const isSwapStep = swappedIndices.length === 2;

      // Try to match values to tracked elements
      array.forEach((value: number, index: number) => {
        const el = this.trackedElements.find((e) => e.value === value && !result.includes(e));
        if (el) {
          // Store previous visual index before updating
          const prevVisualIndex = el.visualIndex;

          el.currentIndex = index;

          if (isSwapStep) {
            // During swap, keep the old visual position for animation
            el.visualIndex = prevVisualIndex;
          } else {
            // Normal step: update visual to match current
            el.visualIndex = index;
          }

          result.push(el);
        } else {
          // Fallback: create new element
          result.push({
            id: this.nextElementId++,
            value,
            currentIndex: index,
            visualIndex: index,
          });
        }
      });

      // Sort by visualIndex so bars render at their OLD positions
      // Then transform will move them to new positions
      return result.sort((a, b) => a.visualIndex - b.visualIndex);
    }
    // Use existing tracked elements if available
    if (this.trackedElements.length > 0) {
      return this.trackedElements.map((el) => {
        const newIndex = array.indexOf(el.value);
        if (newIndex !== -1) {
          el.currentIndex = newIndex;
          el.visualIndex = newIndex;
        }
        return el;
      });
    }

    return array.map((value: any, index: any) => ({
      id: this.nextElementId++,
      value,
      currentIndex: index,
      visualIndex: index,
    }));
  }

  // Get swap offset for horizontal animation
  getTransform(element: TrackedElement): string {
    const stepData = this.visualizationService.currentStepData();
    const swappedIndices = stepData?.swappedIndices || [];

    if (swappedIndices.length === 2) {
      const [leftIdx, rightIdx] = swappedIndices;
      const distance = this.barWidth + 4;

      // Left bar (was at smaller index) - moves right to rightIdx position
      if (element.visualIndex === leftIdx) {
        return `translateX(${distance}px)`;
      }

      // Right bar (was at larger index) - moves left to leftIdx position
      if (element.visualIndex === rightIdx) {
        return `translateX(-${distance}px)`;
      }
    }

    return '';
  }

  // Get height for a tracked element based on its value
  getElementHeight(element: TrackedElement): number {
    const array = this.displayArray;
    const n = array.length;
    if (n === 0) return 8;

    // Create pairs of value and original index
    const pairs = array.map((val, idx) => ({ val, idx }));

    // Sort pairs by value ascending
    const sorted = [...pairs].sort((a, b) => a.val - b.val);

    // Find rank of this element's value
    const rankIndex = sorted.findIndex((item) => item.val === element.value);
    const rank = rankIndex + 1;

    // height = (rank / n) × 100, minimum 8%
    return Math.max(8, Math.round((rank / n) * 100));
  }

  // Check if element at index is highlighted
  isIndexHighlighted(index: number): boolean {
    const highlighted = this.visualizationService.currentStepData()?.highlightedIndices || [];
    return highlighted.includes(index);
  }

  // Check if element at index is swapped
  isIndexSwapped(index: number): boolean {
    const swapped = this.visualizationService.currentStepData()?.swappedIndices || [];
    return swapped.includes(index);
  }

  async runBubbleSort(): Promise<void> {
    if (!this.arrayInput.trim()) {
      this.errorMessage = 'Please enter an array first';
      return;
    }

    const array = this.parseArray(this.arrayInput);

    const validationError = this.validateArray(array);
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.currentArray = array;
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response: AlgorithmResponse = await firstValueFrom(
        this.apiService.runBubbleSort(array),
      );
      this.visualizationService.loadSteps(response.steps);
      this.visualizationService.reset();
    } catch (error) {
      this.errorMessage = 'Failed to run bubble sort. Please try again.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get displayArray(): number[] {
    const stepData = this.visualizationService.currentStepData();
    return stepData?.currentArray || this.currentArray;
  }

  get rankHeights(): number[] {
    const array = this.displayArray;
    const n = array.length;
    if (n === 0) {
      return [];
    }

    // Create pairs of value and original index
    const pairs = array.map((val, idx) => ({ val, idx }));

    // Sort pairs by value ascending
    const sorted = [...pairs].sort((a, b) => a.val - b.val);

    // Assign ranks (1 = smallest, n = largest)
    const ranks = new Array(n);
    sorted.forEach((item, rank) => {
      ranks[item.idx] = rank + 1;
    });

    // height = (rank / n) × 100
    // minimum 8% so smallest bar still visible
    return ranks.map((rank) => Math.max(8, Math.round((rank / n) * 100)));
  }

  isSorted(index: number): boolean {
    // Determine if element is sorted based on current step
    const currentStep = this.visualizationService.currentStep();
    const totalSteps = this.visualizationService.totalSteps();
    const currentArray = this.visualizationService.currentStepData()?.currentArray || [];

    // If we're at the final step, all elements are sorted
    if (currentStep === totalSteps - 1) {
      return true;
    }

    // For bubble sort, elements at the end become sorted as algorithm progresses
    // This is a simplified heuristic - the backend could provide this info
    return false;
  }

  clear(): void {
    this.arrayInput = '';
    this.currentArray = [];
    this.trackedElements = [];
    this.errorMessage = '';
    this.generateCount = 10;
    this.decimalPlaces = 0;
    this.minValue = -1000;
    this.maxValue = 1000;
    this.visualizationService.reset();
    this.visualizationService.loadSteps([]);
    this.barsJustify = 'center';
  }

  /* 
    updateBarWidth: Make sure All Bar Width are same 
    with largest value width contained in the bar width 
  */
  barWidth: number = 40;

  updateBarWidth(array: number[]): void {
    if (array.length === 0) return;

    // Find the longest string representation
    const longestValue = array.reduce((longest, val) => {
      const str = val.toString();
      return str.length > longest.length ? str : longest;
    }, '');

    // Measure text width using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '14px Inter, sans-serif';
      const textWidth = ctx.measureText(longestValue).width;
      // Add 10px extra as requested
      this.barWidth = Math.ceil(textWidth) + 10;
    }
  }

  /*
    updateBarLayout: Adjust justify-content based on total bars width vs container width
     - If bars exceed container width, align to left (flex-start)
     - If bars fit within container, center them
  */

  barsJustify: string = 'center';

  get codeLineNumber(): number | undefined {
    return this.visualizationService.currentStepData()?.codeLineNumber;
  }

  updateBarLayout(array: number[]): void {
    if (array.length === 0) return;

    // Update bar width first
    this.updateBarWidth(array);

    // Wait for DOM to update then check widths
    setTimeout(() => {
      const container = document.querySelector('.bars-container') as HTMLElement;

      if (!container) return;

      const containerWidth = container.clientWidth - 32; // minus padding
      const totalBarsWidth = this.barWidth * array.length + 4 * (array.length - 1); // include gaps

      this.barsJustify = totalBarsWidth >= containerWidth ? 'flex-start' : 'center';
    }, 0);
  }
}
