import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackofficeLayouts as BackofficeLayoutComponent } from './layouts/backoffice-layouts';
import { authGuard } from '../../core/auth/auth-guard';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
    path: '',
    component: BackofficeLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
      { path: 'gestion', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: 'operaciones', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: 'reportes', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
