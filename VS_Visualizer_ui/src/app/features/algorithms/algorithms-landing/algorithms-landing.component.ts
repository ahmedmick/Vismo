import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-algorithms-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './algorithms-landing.component.html',
  styleUrl: './algorithms-landing.component.css'
})
export class AlgorithmsLandingComponent {
  algorithmCategories = [
    {
      name: 'Sorting Algorithms',
      icon: 'sort',
      description: 'Arrange elements in order (Bubble, Merge, Quick Sort)',
      route: '/algorithms/sorting'
    },
    {
      name: 'Searching Algorithms',
      icon: 'search',
      description: 'Find elements in data structures (Linear, Binary Search)',
      route: '/algorithms/searching'
    },
    {
      name: 'Graph Algorithms',
      icon: 'hub',
      description: 'Traverse and analyze graphs (BFS, DFS, Dijkstra)',
      route: '/algorithms/graph-algorithms'
    }
  ];
}
