import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ConformPasswordComponent } from './conform-password/conform-password.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { ShareProfileComponent } from './share-profile/share-profile.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent
      ),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./verify-otp/verify-otp.component').then(
        (m) => m.VerifyOtpComponent
      ),
  },
  {
    path: 'conform-password',
    loadComponent: () =>
      import('./conform-password/conform-password.component').then(
        (m) => m.ConformPasswordComponent
      ),
  },
  {
    path: 'in/:id',
    loadComponent: () =>
      import('./share-profile/share-profile.component').then(
        (m) => m.ShareProfileComponent
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./merchant.routes').then((mod) => mod.MerchantRoutes),
  },
  {
    path: 'customer-dashboard',
    loadChildren: () =>
      import('./customer.routes').then((mod) => mod.CustomerRoutes),
  },
  { path: '**', redirectTo: '' },
];
