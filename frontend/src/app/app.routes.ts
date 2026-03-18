import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/products/pages/collection-page/collection-page').then(m => m.CollectionPage) },
];
