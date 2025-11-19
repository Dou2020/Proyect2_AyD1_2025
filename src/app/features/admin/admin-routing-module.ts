import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayouts as AdminLayoutComponent } from './layouts/admin-layouts';
import { authGuard } from '../../core/auth/auth-guard';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
      { path: 'usuarios', loadComponent: () => import('./users/users').then(c => c.Users) },
      { path: 'tarifas-base', loadComponent: () => import('./base-free/base-free').then(c => c.BaseFree) },
      { path: 'subcursales', loadComponent: () => import('./subcursal/subcursal').then(c => c.Subcursal) },
      { path: 'subcursales/:id/comercios', loadComponent: () => import('./commerce/commerce').then(c => c.Commerce) },
      { path: 'perfil', loadComponent: () => import('./profile/profile').then(c => c.Profile) },
      { path: 'subscription', loadComponent: () => import('./subscription/subscription').then(c => c.Subscription) },
      { path: 'configuracion', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: 'reportes', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
