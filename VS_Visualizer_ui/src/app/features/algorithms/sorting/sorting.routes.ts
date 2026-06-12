import { Routes } from '@angular/router';

export const SORTING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./sorting-landing/sorting-landing.component')
            .then(m => m.SortingLandingComponent)
    },
    {
        path: 'bubble-sort',
        loadComponent: () => import('./bubble-sort/bubble-sort.component')
            .then(m => m.BubbleSortComponent)
    },
    {
        path: 'merge-sort',
        loadComponent: () => import('./merge-sort/merge-sort.component')
            .then(m => m.MergeSortComponent)
    },
    {
        path: 'quick-sort',
        loadComponent: () => import('./quick-sort/quick-sort.component')
            .then(m => m.QuickSortComponent)
    }
];
