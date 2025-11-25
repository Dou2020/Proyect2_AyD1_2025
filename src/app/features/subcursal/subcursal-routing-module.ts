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
      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard) 
      },
      { 
        path: 'tickets', 
        loadComponent: () => import('./ticket/ticket').then(c => c.Ticket) 
      },
      { 
        path: 'fee', 
        loadComponent: () => import('./fee/fee').then(c => c.Fee) 
      }, 
      { 
        path: 'incidents', 
        loadComponent: () => import('./incident/incident').then(c => c.Incident) 
      },
      { 
        path: 'groups', 
        loadComponent: () => import('./groups/groups').then(c => c.Groups) 
      },
      { 
        path: 'groups/tickets/:groupId', 
        loadComponent: () => import('./ticket-group/ticket-group').then(c => c.TicketGroup) 
      },
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class SubcursalRoutingModule { }
