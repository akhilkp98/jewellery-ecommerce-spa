import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'collections', pathMatch: 'full' },
    { 
        path: 'collections', 
        loadComponent: () => import('./features/products/pages/collection-page/collection-page').then(m => m.CollectionPage),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/pages/login/login').then(m => m.Login),
        canActivate: [guestGuard]
    },
    { path: '**', redirectTo: 'collections' }
];
