import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayouts as ClientLayoutComponent } from './layouts/client-layouts';
import { authGuard } from '../../core/auth/auth-guard';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard)
      },
      { path: 'vehicles', 
        loadComponent: () => import('./vehicles/vehicles').then(c => c.Vehicles) 
      }, 
      { path: 'subscriptions', 
        loadComponent: () => import('./subscriptions/subscriptions').then(c => c.Subscriptions) 
      }, 
      { 
        path: 'vehicles/link', 
        loadComponent: () => import('./link-vehicles/link-vehicles').then(c => c.LinkVehicles) 
      },
      { 
        path: 'vehicles/facturation', 
        loadComponent: () => import('./facturation/facturation').then(c => c.Facturation) 
      },
      { 
        path: 'transfers', 
        loadComponent: () => import('./temporal-transfer/temporal-transfer').then(c => c.TemporalTransfer) 
      },
      { 
        path: '', 
        redirectTo: 'dashboard', pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ReactiveFormsModule],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
