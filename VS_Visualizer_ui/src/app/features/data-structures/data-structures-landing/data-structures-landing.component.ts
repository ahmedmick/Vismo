import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-structures-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './data-structures-landing.component.html',
  styleUrl: './data-structures-landing.component.css'
})
export class DataStructuresLandingComponent {
  dataStructures = [
    {
      name: 'Array',
      icon: 'view_module',
      description: 'Sequential collection with index-based access',
      route: '/data-structures/array'
    },
    {
      name: 'Linked List',
      icon: 'link',
      description: 'Chain of nodes with pointers',
      route: '/data-structures/linked-list'
    },
    {
      name: 'Stack',
      icon: 'layers',
      description: 'LIFO - Last In First Out',
      route: '/data-structures/stack'
    },
    {
      name: 'Queue',
      icon: 'format_list_bulleted',
      description: 'FIFO - First In First Out',
      route: '/data-structures/queue'
    },
    {
      name: 'Tree',
      icon: 'account_tree',
      description: 'Hierarchical structure with root and nodes',
      route: '/data-structures/tree'
    },
    {
      name: 'Graph',
      icon: 'share',
      description: 'Network of connected nodes and edges',
      route: '/data-structures/graph'
    }
  ];
}
