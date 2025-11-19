import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login as LoginComponent } from './login/login';
import { Register as RegisterComponent } from './register/register';
import { TwoFactorAuth as TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth';
import { authGuard } from '../../core/auth//auth-guard';
import { RecoveryPassword } from './recovery-password/recovery-password';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register)
  },
  {
    path: 'two-factor-auth',
    component: TwoFactorAuthComponent
  },
  {
    path: 'recovery-password',
    component: RecoveryPassword
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('../admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'client',
    canActivate: [authGuard],
    loadChildren: () =>
      import('../client/client-module').then(m => m.ClientModule)
  },
    {
    path: 'backoffice',
    canActivate: [authGuard],
    loadChildren: () =>
      import('../backoffice/backoffice-module').then(m => m.BackofficeModule)
  },
  {
    path: 'commerce',
    canActivate: [authGuard],
    loadChildren: () =>
      import('../commerce/commerce-module').then(m => m.CommerceModule)
  },
    {
    path: 'subcursal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('../subcursal/subcursal-module').then(m => m.SubcursalModule)
  },


  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
