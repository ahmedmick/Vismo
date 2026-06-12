import { Routes } from '@angular/router';

export const DATA_STRUCTURES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./data-structures-landing/data-structures-landing.component')
            .then(m => m.DataStructuresLandingComponent)
    },
    {
        path: 'array',
        loadComponent: () => import('./array/array.component')
            .then(m => m.ArrayComponent)
    },
    {
        path: 'linked-list',
        loadComponent: () => import('./linked-list/linked-list-shell.component')
            .then(m => m.LinkedListShellComponent)
    },
    {
        path: 'stack',
        loadComponent: () => import('./stack/stack.component')
            .then(m => m.StackComponent)
    },
    {
        path: 'queue',
        loadComponent: () => import('./queue/queue.component')
            .then(m => m.QueueComponent)
    },
    {
        path: 'tree',
        loadComponent: () => import('./tree/tree.component')
            .then(m => m.TreeComponent)
    },
    {
        path: 'graph',
        loadComponent: () => import('./graph/graph.component')
            .then(m => m.GraphComponent)
    }
];
