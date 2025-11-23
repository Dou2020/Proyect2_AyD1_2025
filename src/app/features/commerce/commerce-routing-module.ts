import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommerceLayouts } from './layouts/commerce-layouts';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from '../../core/auth/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: CommerceLayouts,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
      },
      {
        path: 'subcursal',
        loadComponent: () => import('./subcursal/subcursal').then(m => m.Subcursal),
        canActivate: [authGuard]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes').then(m => m.Reportes),
        canActivate: [authGuard]
      },
      {
        path: 'descuentos',
        loadComponent: () => import('./discount/discount').then(m => m.Discount),
        canActivate: [authGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommerceRoutingModule { }
