import { Routes } from '@angular/router';
import { AddUrlComponent } from './add-url/add-url.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';

export const shopRoutes: Routes = [
  { path: '', component: AddUrlComponent },
  { path: 'editShop', component: EditShopComponent },
];
