import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ConformPasswordComponent } from './conform-password/conform-password.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddShopComponent } from './add-shop/add-shop.component';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'addUser', component: AddCustomerComponent },
      { path: 'deleteUser', component: DeleteCustomerComponent },
      { path: 'addShop', component: AddShopComponent },
    ],
  },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'conform-password', component: ConformPasswordComponent },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
  },
];
