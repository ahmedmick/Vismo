import { Routes } from '@angular/router';

export const GRAPH_ALGORITHMS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./graph-algorithms-landing/graph-algorithms-landing.component')
            .then(m => m.GraphAlgorithmsLandingComponent)
    },
    {
        path: 'bfs',
        loadComponent: () => import('./bfs/bfs.component')
            .then(m => m.BfsComponent)
    },
    {
        path: 'dfs',
        loadComponent: () => import('./dfs/dfs.component')
            .then(m => m.DfsComponent)
    },
    {
        path: 'dijkstra',
        loadComponent: () => import('./dijkstra/dijkstra.component')
            .then(m => m.DijkstraComponent)
    }
];
