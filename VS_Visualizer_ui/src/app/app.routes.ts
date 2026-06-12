import { Routes } from '@angular/router';
import { Header } from './core/components/header/header';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'header', component: Header },
    { path: 'home', component: Home },
    {
        path: 'data-structures',
        loadChildren: () => import('./features/data-structures/data-structures.routes').then(m => m.DATA_STRUCTURES_ROUTES)
    },
    {
        path: 'algorithms',
        loadChildren: () => import('./features/algorithms/algorithms.routes').then(m => m.ALGORITHMS_ROUTES)
    }
];
