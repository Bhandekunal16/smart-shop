import { Routes } from '@angular/router';
import { ProfileFaqComponent } from './profile-faq/profile-faq.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

export const profileRoutes: Routes = [
  { path: '', component: ProfileFaqComponent },
  { path: 'update', component: UpdateProfileComponent },
];
