import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'View',
            icon: 'pi pi-fw pi-video',
          },
        ],
      },
      {
        label: 'Inventory',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'ProductList',
            icon: 'pi pi-fw pi-align-left',
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-fw pi-align-right',
          },
          {
            label: 'Purchases',
            icon: 'pi pi-fw pi-align-center',
          },
          {
            label: 'Feedback',
            icon: 'pi pi-fw pi-align-justify',
          },
        ],
      },

      {
        label: 'Subscriptions',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'View',
            icon: 'pi pi-fw pi-pencil',
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
    ];
  }

  login(): void {
    this.router.navigate(['']);
  }
}
