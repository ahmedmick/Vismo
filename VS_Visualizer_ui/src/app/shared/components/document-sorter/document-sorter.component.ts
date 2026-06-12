import { Component, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-document-sorter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './document-sorter.component.html',
  styleUrl: './document-sorter.component.css'
})
export class DocumentSorterComponent implements OnInit {
  documents = signal<Document[]>([]);
  comparingIndices = signal<[number, number] | null>(null);
  currentIndex = signal(0);
  isComplete = signal(false);

  private originalDocuments: Document[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.http.get<Document[]>('http://localhost:9090/api/documents').subscribe({
      next: (docs) => {
        this.originalDocuments = JSON.parse(JSON.stringify(docs));
        this.documents.set(docs);
        this.currentIndex.set(0);
        this.isComplete.set(false);
        this.comparingIndices.set(null);
      },
      error: (err) => console.error('Error fetching documents:', err)
    });
  }

  reset(): void {
    this.documents.set(JSON.parse(JSON.stringify(this.originalDocuments)));
    this.currentIndex.set(0);
    this.isComplete.set(false);
    this.comparingIndices.set(null);
  }

  prevStep(): void {
    if (this.currentIndex() === 0) return;

    const docs = [...this.documents()];
    const n = docs.length;
    const pass = Math.floor((this.currentIndex() - 1) / (n - 1));
    const compareIndex = (this.currentIndex() - 1) % (n - 1 - pass);

    if (pass >= n - 1) {
      this.isComplete.set(false);
      this.comparingIndices.set([compareIndex, compareIndex + 1]);
      return;
    }

    this.comparingIndices.set([compareIndex, compareIndex + 1]);

    if (docs[compareIndex].relevanceScore > docs[compareIndex + 1].relevanceScore) {
      const temp = docs[compareIndex];
      docs[compareIndex] = docs[compareIndex + 1];
      docs[compareIndex + 1] = temp;
      this.documents.set(docs);
    }

    this.currentIndex.set(this.currentIndex() - 1);
  }

  nextStep(): void {
    const docs = [...this.documents()];
    const n = docs.length;
    const pass = Math.floor(this.currentIndex() / (n - 1));
    const compareIndex = this.currentIndex() % (n - 1 - pass);

    if (pass >= n - 1) {
      this.isComplete.set(true);
      this.comparingIndices.set(null);
      return;
    }

    this.comparingIndices.set([compareIndex, compareIndex + 1]);

    if (docs[compareIndex].relevanceScore > docs[compareIndex + 1].relevanceScore) {
      const temp = docs[compareIndex];
      docs[compareIndex] = docs[compareIndex + 1];
      docs[compareIndex + 1] = temp;
      this.documents.set(docs);
    }

    this.currentIndex.set(this.currentIndex() + 1);
  }

  autoSort(): void {
    const docs = [...this.documents()];
    const n = docs.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (docs[j].relevanceScore > docs[j + 1].relevanceScore) {
          const temp = docs[j];
          docs[j] = docs[j + 1];
          docs[j + 1] = temp;
        }
      }
    }

    this.documents.set(docs);
    this.isComplete.set(true);
    this.comparingIndices.set(null);
  }
}
