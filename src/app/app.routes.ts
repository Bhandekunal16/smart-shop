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
import { ViewShopComponent } from './view-shop/view-shop.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { DisableShopComponent } from './disable-shop/disable-shop.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ChartProductComponent } from './chart-product/chart-product.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'conform-password', component: ConformPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'addUser', component: AddCustomerComponent },
      { path: 'deleteUser', component: DeleteCustomerComponent },
      { path: 'addShop', component: AddShopComponent },
      { path: 'viewShop', component: ViewShopComponent },
      { path: 'editShop', component: EditShopComponent },
      { path: 'disableShop', component: DisableShopComponent },
      { path: 'addProduct', component: AddProductComponent },
      { path: 'viewProduct', component: ViewProductComponent },
      { path: 'editProduct', component: EditProductComponent },
      { path: 'updateProduct', component: UpdateProductComponent },
      { path: '', component: ChartProductComponent },
    ],
  },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
  },
];
