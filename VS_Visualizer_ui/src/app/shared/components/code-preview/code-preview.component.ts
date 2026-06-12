import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

type Language = 'python' | 'java' | 'cpp' | 'javascript';

interface CodeToken {
  text: string;
  type: 'keyword' | 'type' | 'function' | 'string' | 'comment' | 'number' | 'operator' | 'plain';
}

interface CodeLine {
  lineNumber: number;
  tokens: CodeToken[];
}

@Component({
  selector: 'app-code-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './code-preview.component.html',
  styleUrl: './code-preview.component.css',
})
export class CodePreviewComponent {
  @Input() codeLineNumber: number | undefined = undefined;

  selectedLanguage = signal<Language>('python');

  languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'javascript', label: 'JavaScript' },
  ];

  get currentCode(): CodeLine[] {
    return this.codeByLanguage[this.selectedLanguage()];
  }

  onLanguageChange(lang: Language): void {
    this.selectedLanguage.set(lang);
  }

  private codeByLanguage: Record<Language, CodeLine[]> = {
    python: [
      { lineNumber: 1, tokens: [{ text: 'def ', type: 'keyword' }, { text: 'bubble_sort', type: 'function' }, { text: '(arr):', type: 'plain' }] },
      { lineNumber: 2, tokens: [{ text: '    n = ', type: 'plain' }, { text: 'len', type: 'function' }, { text: '(arr)', type: 'plain' }] },
      { lineNumber: 3, tokens: [{ text: '    for i in ', type: 'keyword' }, { text: 'range', type: 'function' }, { text: '(n - 1):', type: 'plain' }] },
      { lineNumber: 4, tokens: [{ text: '        if ', type: 'keyword' }, { text: 'arr[j] > arr[j + 1]', type: 'plain' }, { text: ':', type: 'operator' }] },
      { lineNumber: 5, tokens: [{ text: '            # swap elements', type: 'comment' }] },
      { lineNumber: 6, tokens: [{ text: '            arr[j], arr[j + 1] = arr[j + 1], arr[j]', type: 'plain' }] },
      { lineNumber: 7, tokens: [{ text: '    return arr', type: 'keyword' }] },
    ],
    java: [
      { lineNumber: 1, tokens: [{ text: 'public ', type: 'keyword' }, { text: 'static ', type: 'keyword' }, { text: 'void ', type: 'type' }, { text: 'bubbleSort', type: 'function' }, { text: '(int[] arr) {', type: 'plain' }] },
      { lineNumber: 2, tokens: [{ text: '    int ', type: 'type' }, { text: 'n = arr.length', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 3, tokens: [{ text: '    for (int i = 0; i < n - 1; i++) {', type: 'keyword' }] },
      { lineNumber: 4, tokens: [{ text: '        if (arr[j] > arr[j + 1]) {', type: 'keyword' }] },
      { lineNumber: 5, tokens: [{ text: '            // swap elements', type: 'comment' }] },
      { lineNumber: 6, tokens: [{ text: '            int ', type: 'type' }, { text: 'temp = arr[j]', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 7, tokens: [{ text: '            arr[j] = arr[j + 1]', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 8, tokens: [{ text: '            arr[j + 1] = temp', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 9, tokens: [{ text: '        }', type: 'keyword' }] },
      { lineNumber: 10, tokens: [{ text: '    }', type: 'keyword' }] },
      { lineNumber: 11, tokens: [{ text: '}', type: 'keyword' }] },
    ],
    cpp: [
      { lineNumber: 1, tokens: [{ text: 'void ', type: 'type' }, { text: 'bubbleSort', type: 'function' }, { text: '(vector<int>& arr) {', type: 'plain' }] },
      { lineNumber: 2, tokens: [{ text: '    int ', type: 'type' }, { text: 'n = arr.size()', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 3, tokens: [{ text: '    for (int i = 0; i < n - 1; i++) {', type: 'keyword' }] },
      { lineNumber: 4, tokens: [{ text: '        if (arr[j] > arr[j + 1]) {', type: 'keyword' }] },
      { lineNumber: 5, tokens: [{ text: '            // swap elements', type: 'comment' }] },
      { lineNumber: 6, tokens: [{ text: '            swap', type: 'function' }, { text: '(arr[j], arr[j + 1])', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 7, tokens: [{ text: '        }', type: 'keyword' }] },
      { lineNumber: 8, tokens: [{ text: '    }', type: 'keyword' }] },
      { lineNumber: 9, tokens: [{ text: '}', type: 'keyword' }] },
    ],
    javascript: [
      { lineNumber: 1, tokens: [{ text: 'function ', type: 'keyword' }, { text: 'bubbleSort', type: 'function' }, { text: '(arr) {', type: 'plain' }] },
      { lineNumber: 2, tokens: [{ text: '    const ', type: 'keyword' }, { text: 'n = arr.length', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 3, tokens: [{ text: '    for (let i = 0; i < n - 1; i++) {', type: 'keyword' }] },
      { lineNumber: 4, tokens: [{ text: '        if (arr[j] > arr[j + 1]) {', type: 'keyword' }] },
      { lineNumber: 5, tokens: [{ text: '            // swap elements', type: 'comment' }] },
      { lineNumber: 6, tokens: [{ text: '            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]', type: 'plain' }, { text: ';', type: 'operator' }] },
      { lineNumber: 7, tokens: [{ text: '    }', type: 'keyword' }] },
      { lineNumber: 8, tokens: [{ text: '}', type: 'keyword' }] },
    ],
  };
}
