import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { ShareProfileComponent } from './share-profile/share-profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'in/:id', component: ShareProfileComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () =>
      import('./merchant.routes').then((mod) => mod.MerchantRoutes),
  },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
    loadChildren: () =>
      import('./customer.routes').then((mod) => mod.CustomerRoutes),
  },
  { path: '**', redirectTo: '' },
];
