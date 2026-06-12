import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sorting-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './sorting-landing.component.html',
  styleUrl: './sorting-landing.component.css'
})
export class SortingLandingComponent {
  sortingAlgorithms = [
    {
      name: 'Bubble Sort',
      icon: 'bubble_chart',
      description: 'Simple comparison-based sorting algorithm',
      route: '/algorithms/sorting/bubble-sort',
      available: true
    },
    {
      name: 'Merge Sort',
      icon: 'call_merge',
      description: 'Divide and conquer sorting algorithm',
      route: '/algorithms/sorting/merge-sort',
      available: false
    },
    {
      name: 'Quick Sort',
      icon: 'flash_on',
      description: 'Efficient divide and conquer sorting',
      route: '/algorithms/sorting/quick-sort',
      available: false
    }
  ];
}
