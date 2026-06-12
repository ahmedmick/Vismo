import { Routes } from '@angular/router';

export const SEARCHING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./searching-landing/searching-landing.component')
            .then(m => m.SearchingLandingComponent)
    },
    {
        path: 'linear-search',
        loadComponent: () => import('./linear-search/linear-search.component')
            .then(m => m.LinearSearchComponent)
    },
    {
        path: 'binary-search',
        loadComponent: () => import('./binary-search/binary-search.component')
            .then(m => m.BinarySearchComponent)
    }
];
