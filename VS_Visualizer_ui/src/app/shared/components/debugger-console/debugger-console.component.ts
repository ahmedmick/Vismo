import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

interface Document {
  id: number;
  title: string;
  author: string;
  relevanceScore: number;
}

interface VisualizationStep {
  array: number[];
  description: string;
  codeLineNumber: number;
}

@Component({
  selector: 'app-debugger-console',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './debugger-console.component.html',
  styleUrl: './debugger-console.component.css'
})
export class DebuggerConsoleComponent implements OnInit, AfterViewChecked {
  @ViewChild('logContainer') private logContainer!: ElementRef;
  
  documents = signal<Document[]>([]);
  steps = signal<VisualizationStep[]>([]);
  currentStepIndex = signal(0);
  currentCodeLine = signal(1);
  humanLogs = signal<string[]>([]);
  isComplete = signal(false);
  private shouldScroll = false;

  visibleLogs = computed(() => {
    const logs = this.humanLogs();
    if (!logs || logs.length === 0) return ['Waiting for data...'];
    const idx = this.currentStepIndex();
    return logs.slice(0, Math.min(idx + 1, logs.length));
  });

  currentArray = computed(() => {
    const allSteps = this.steps();
    if (!allSteps || allSteps.length === 0) return [50, 50, 50, 50, 50, 50];
    const idx = this.currentStepIndex();
    return allSteps[idx]?.array || [50, 50, 50, 50, 50, 50];
  });

  pseudoCode = [
    'for i = 0 to n-1:',
    '  for j = 0 to n-i-2:',
    '    if documents[j].score > documents[j+1].score:',
    '      swap(documents[j], documents[j+1])'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  fetchDocuments(): void {
    const randomDocs: Document[] = [];
    for (let i = 0; i < 6; i++) {
      randomDocs.push({
        id: i,
        title: `Item ${i + 1}`,
        author: '',
        relevanceScore: Math.floor(Math.random() * 80) + 10
      });
    }
    this.documents.set(randomDocs);
    this.generateSteps(randomDocs);
  }

  generateSteps(docs: Document[]): void {
    const arr = docs.map(d => d.relevanceScore);
    const n = arr.length;
    const generatedSteps: VisualizationStep[] = [];
    const logs: string[] = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const currentArr = [...arr];
        
        generatedSteps.push({
          array: currentArr,
          description: `Comparing indices ${j} and ${j + 1}`,
          codeLineNumber: 3
        });

        const val1 = currentArr[j];
        const val2 = currentArr[j + 1];
        
        logs.push(`Comparing ${val1} with ${val2}. Array: [${currentArr.join(', ')}]`);

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          const swappedArr = [...arr];
          logs.push(`Swapping! ${val1} > ${val2}, so they swap positions. Array: [${swappedArr.join(', ')}]`);

          generatedSteps.push({
            array: swappedArr,
            description: `Swapped indices ${j} and ${j + 1}`,
            codeLineNumber: 4
          });
        } else {
          logs.push(`No swap needed - ${val1} <= ${val2}.`);
        }
      }
      const sortedArr = [...arr];
      generatedSteps.push({
        array: sortedArr,
        description: `Element at index ${n - i - 1} is now in sorted position`,
        codeLineNumber: 1
      });
      logs.push(`Pass ${i + 1} complete. Position ${n - i - 1} is sorted (value: ${sortedArr[n - i - 1]}).`);
    }

    generatedSteps.push({
      array: [...arr],
      description: 'Array is fully sorted!',
      codeLineNumber: 1
    });
    logs.push(`Sorting complete! Final array: [${arr.join(', ')}]`);

    this.steps.set(generatedSteps);
    this.humanLogs.set(logs);
    this.currentStepIndex.set(0);
    this.currentCodeLine.set(3);
    this.isComplete.set(false);
  }

  nextStep(): void {
    const idx = this.currentStepIndex();
    const allSteps = this.steps();

    if (idx < allSteps.length - 1) {
      this.currentStepIndex.set(idx + 1);
      this.currentCodeLine.set(allSteps[idx + 1].codeLineNumber);
      this.shouldScroll = true;
    } else {
      this.isComplete.set(true);
    }
  }

  prevStep(): void {
    const idx = this.currentStepIndex();
    const allSteps = this.steps();

    if (idx > 0) {
      this.currentStepIndex.set(idx - 1);
      this.currentCodeLine.set(allSteps[idx - 1].codeLineNumber);
    }
  }

  reset(): void {
    this.fetchDocuments();
  }
}
