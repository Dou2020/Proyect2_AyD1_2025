import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcursalLayouts as SubcursalLayoutComponent } from './layouts/subcursal-layouts';
import { authGuard } from '../../core/auth/auth-guard';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
    path: '',
    component: SubcursalLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) },
      { path: 'servicios', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: 'clientes', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: 'reportes', loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) }, // Placeholder
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class SubcursalRoutingModule { }
