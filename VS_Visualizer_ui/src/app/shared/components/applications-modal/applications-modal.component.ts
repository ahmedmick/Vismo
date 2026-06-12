import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

interface ApplicationExample {
  id: string;
  titleKey: string;
  descriptionKey: string;
  placeholderKey: string;
  inputType: 'number' | 'text';
}

@Component({
  selector: 'app-applications-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    TranslateModule
  ],
  templateUrl: './applications-modal.component.html',
  styleUrl: './applications-modal.component.css'
})
export class ApplicationsModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  examples: ApplicationExample[] = [
    {
      id: 'scores',
      titleKey: 'APPLICATIONS.TEST_SCORES_TITLE',
      descriptionKey: 'APPLICATIONS.TEST_SCORES_DESC',
      placeholderKey: 'APPLICATIONS.SCORES_PLACEHOLDER',
      inputType: 'number'
    },
    {
      id: 'names',
      titleKey: 'APPLICATIONS.NAMES_TITLE',
      descriptionKey: 'APPLICATIONS.NAMES_DESC',
      placeholderKey: 'APPLICATIONS.NAMES_PLACEHOLDER',
      inputType: 'text'
    },
    {
      id: 'prices',
      titleKey: 'APPLICATIONS.PRICES_TITLE',
      descriptionKey: 'APPLICATIONS.PRICES_DESC',
      placeholderKey: 'APPLICATIONS.PRICES_PLACEHOLDER',
      inputType: 'number'
    },
    {
      id: 'leaderboard',
      titleKey: 'APPLICATIONS.LEADERBOARD_TITLE',
      descriptionKey: 'APPLICATIONS.LEADERBOARD_DESC',
      placeholderKey: 'APPLICATIONS.LEADERBOARD_PLACEHOLDER',
      inputType: 'number'
    }
  ];

  selectedExample = signal<ApplicationExample>(this.examples[0]);
  userInput = '';
  sortedResult: string[] = [];
  isSorted = signal(false);

  selectExample(example: ApplicationExample): void {
    this.selectedExample.set(example);
    this.userInput = '';
    this.sortedResult = [];
    this.isSorted.set(false);
  }

  runBubbleSort(): void {
    if (!this.userInput.trim()) return;

    const input = this.userInput.split(',').map(s => s.trim());
    const arr = [...input];
    
    // Bubble sort implementation
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let shouldSwap = false;
        
        if (this.selectedExample().inputType === 'number') {
          shouldSwap = parseFloat(arr[j]) > parseFloat(arr[j + 1]);
        } else {
          shouldSwap = arr[j].localeCompare(arr[j + 1]) > 0;
        }
        
        if (shouldSwap) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    
    this.sortedResult = arr;
    this.isSorted.set(true);
  }

  onClose(): void {
    this.userInput = '';
    this.sortedResult = [];
    this.isSorted.set(false);
    this.close.emit();
  }
}
