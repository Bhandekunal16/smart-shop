import { Routes } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddShopComponent } from './add-shop/add-shop.component';
import { BuyRequestComponent } from './buyrequest/buyrequest.component';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { FeedComponent } from './feed/feed.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PaymentComponent } from './payment/payment.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { ShareComponent } from './share/share.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserAddWishlistComponent } from './user-add-wishlist/user-add-wishlist.component';
import { UserViewWishlistComponent } from './user-view-wishlist/user-view-wishlist.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewShopComponent } from './view-shop/view-shop.component';
import { ProfileComponent } from './profile/profile.component';
import { ChartheadComponent } from './charthead/charthead.component';

export const MerchantRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'addUser', component: AddCustomerComponent },
      { path: 'deleteUser', component: DeleteCustomerComponent },
      { path: 'addShop', component: AddShopComponent },
      {
        path: 'viewShop',
        component: ViewShopComponent,
      },
      { path: 'editShop', component: EditShopComponent },
      { path: 'addProduct', component: AddProductComponent },
      {
        path: 'viewProduct',
        component: ViewProductComponent,
      },
      { path: '', component: ChartheadComponent },
      { path: 'userList', component: UserlistComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'buyRequest', component: BuyRequestComponent },
      {
        path: 'updateProfile',
        component: UpdateProfileComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        loadChildren: () =>
          import('./profile.routes').then((mod) => mod.profileRoutes),
      },
      { path: 'share', component: ShareComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'userViewWishList', component: UserViewWishlistComponent },
      { path: 'userAddWishList', component: UserAddWishlistComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'purchasedList', component: PurchaseListComponent },
    ],
  },
];
