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
        path: 'productos',
        loadComponent: () => import('./productos/productos').then(m => m.Productos),
        canActivate: [authGuard]
      },
      {
        path: 'ventas',
        loadComponent: () => import('./ventas/ventas').then(m => m.Ventas),
        canActivate: [authGuard]
      },
      {
        path: 'inventario',
        loadComponent: () => import('./inventario/inventario').then(m => m.Inventario),
        canActivate: [authGuard]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes').then(m => m.Reportes),
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
