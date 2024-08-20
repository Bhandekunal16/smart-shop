import { Routes } from '@angular/router';
import { CustomerAddSubscriptionComponent } from './customer-add-subscribtion/customer-add-subscribtion.component';
import { CustomerViewProductComponent } from './customer-view-product/customer-view-product.component';
import { CustomerViewSubscriptionComponent } from './customer-view-subscribtion/customer-view-subscribtion.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { ReceptComponent } from './recipt/recipt.component';
import { ShareComponent } from './share/share.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateRatingComponent } from './update-rating/update-rating.component';
import { UserAddWishlistComponent } from './user-add-wishlist/user-add-wishlist.component';
import { UserViewWishlistComponent } from './user-view-wishlist/user-view-wishlist.component';
import { ViewShopComponent } from './view-shop/view-shop.component';
import { ProfileFaqComponent } from './profile-faq/profile-faq.component';

export const CustomerRoutes: Routes = [
  { path: '', component: CustomerViewProductComponent },
  { path: 'addSubscription', component: CustomerAddSubscriptionComponent },
  {
    path: 'viewSubscription',
    component: CustomerViewSubscriptionComponent,
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: '', component: ProfileFaqComponent },
      { path: 'update', component: UpdateProfileComponent },
    ],
  },
  {
    path: 'updateProfile',
    component: UpdateProfileComponent,
  },
  { path: 'updateRating', component: UpdateRatingComponent },
  { path: 'userAddWishList', component: UserAddWishlistComponent },
  { path: 'userViewWishList', component: UserViewWishlistComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'purchasedList', component: PurchaseListComponent },
  { path: 'recept', component: ReceptComponent },
  { path: 'share', component: ShareComponent },
  { path: 'viewShop', component: ViewShopComponent },
];
