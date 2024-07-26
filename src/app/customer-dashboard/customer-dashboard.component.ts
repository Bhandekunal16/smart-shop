import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { NetworkStatusService } from '../network-status.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  items: MenuItem[] | undefined;
  onlineStatus: boolean = true;

  constructor(
    private router: Router,
    private statusService: StateService,
    private networkStatusService: NetworkStatusService
  ) {}

  ngOnInit(): void {
    let value: boolean;
    this.statusService.status$.subscribe((status) => {
      this.updateMenuItems(status);
      value = status;
    });

    this.networkStatusService.onlineStatus$.subscribe((status) => {
      this.onlineStatus = status;
      this.updateMenuItems(value);
    });
  }

  updateMenuItems(status: boolean) {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => {
              this.profile();
            },
          },
        ],
      },
      {
        label: 'Inventory',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'ProductList',
            icon: 'pi pi-fw pi-list',
            command: () => {
              this.initial();
            },
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-fw pi-list-check',
            command: () => {
              this.WishList();
            },
          },
          {
            label: 'Purchases',
            icon: 'pi pi-fw pi-receipt',
            command: () => {
              this.list();
            },
          },
        ],
      },
      {
        label: 'Subscriptions',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => {
              this.viewSubscriptionRoute();
            },
          },
          {
            label: 'Add',
            icon: 'pi pi-fw pi-plus',
            command: () => {
              this.addSubscription();
            },
          },
        ],
      },
      {
        label: 'Log-out',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.login();
        },
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: status ? 'Account Enabled' : 'Account Disabled',
            icon: status ? 'pi pi-fw pi-unlock' : 'pi pi-fw pi-lock',
          },
          {
            label: this.onlineStatus ? 'Online' : 'Offline',
            icon: this.onlineStatus ? 'pi pi-fw pi-wifi' : 'pi pi-fw pi-globe',
          },
          {
            label: 'Share',
            icon: 'pi pi-fw pi-share-alt',
            command: () => {
              this.share();
            },
          },
        ],
      },
      {
        label: 'Feedback',
        icon: 'pi pi-fw pi-comment',
        command: () => {
          this.feedback();
        },
      },
    ];
  }

  login(): void {
    this.router.navigate(['']);
  }

  addSubscription(): void {
    this.router.navigate(['customer-dashboard/addSubscription']);
  }

  initial() {
    this.router.navigate(['customer-dashboard']);
  }

  WishList() {
    this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  profile() {
    this.router.navigate(['customer-dashboard/profile']);
  }

  viewSubscriptionRoute() {
    this.router.navigate(['customer-dashboard/viewSubscription']);
  }

  feedback() {
    this.router.navigate(['customer-dashboard/feedback']);
  }

  list() {
    this.router.navigate(['customer-dashboard/purchasedList']);
  }

  share() {
    this.router.navigate(['customer-dashboard/share']);
  }
}
