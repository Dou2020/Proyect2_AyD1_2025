import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/public/public-module').then(m => m.PublicModule),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin-module').then(m => m.AdminModule),
  },
  {
    path: 'client',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/client/client-module').then(m => m.ClientModule),
  },
  {
    path: 'backoffice',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/backoffice/backoffice-module').then(m => m.BackofficeModule),
  },
  {
    path: 'subcursal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/subcursal/subcursal-module').then(m => m.SubcursalModule),
  },
  {
    path: 'commerce',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/commerce/commerce-module').then(m => m.CommerceModule),
  },
  { path: '**', redirectTo: '' }
];
