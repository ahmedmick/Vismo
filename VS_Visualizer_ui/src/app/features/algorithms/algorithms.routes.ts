import { Routes } from '@angular/router';

export const ALGORITHMS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./algorithms-landing/algorithms-landing.component')
            .then(m => m.AlgorithmsLandingComponent)
    },
    {
        path: 'sorting',
        loadChildren: () => import('./sorting/sorting.routes').then(m => m.SORTING_ROUTES)
    },
    {
        path: 'searching',
        loadChildren: () => import('./searching/searching.routes').then(m => m.SEARCHING_ROUTES)
    },
    {
        path: 'graph-algorithms',
        loadChildren: () => import('./graph-algorithms/graph-algorithms.routes').then(m => m.GRAPH_ALGORITHMS_ROUTES)
    }
];
