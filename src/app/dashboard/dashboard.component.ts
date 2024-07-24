import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NetworkStatusService } from '../network-status.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  items: MenuItem[] | undefined;
  onlineStatus: boolean = true;

  constructor(
    private router: Router,
    private statusService: StateService,
    private networkStatusService: NetworkStatusService
  ) {}

  ngOnInit() {
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
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            command: () => {
              this.update();
            },
          },
          {
            label: status ? 'Account Enabled' : 'Account Disabled',
            icon: status ? 'pi pi-fw pi-unlock' : 'pi pi-fw pi-lock',
          },
          {
            label: this.onlineStatus ? 'Online' : 'Offline',
            icon: this.onlineStatus ? 'pi pi-fw pi-wifi' : 'pi pi-fw pi-globe',
          },
          {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
              this.login();
            },
          },
        ],
      },

      {
        label: 'Shop',
        icon: 'pi pi-fw pi-shop',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-user-edit',
            command: () => this.editShop(),
          },
          {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => this.viewShop(),
          },
          {
            label: 'Disable/Enable',
            icon: 'pi pi-fw pi-play',
            command: () => this.DisableShop(),
          },
          {
            label: 'Add',
            icon: 'pi pi-fw pi-cart-plus',
            command: () => this.addShop(),
          },
        ],
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus',
            command: () => {
              this.addUser();
            },
          },

          {
            label: 'customer-list',
            icon: 'pi pi-fw pi-list',
            command: () => {
              this.ViewUser();
            },
          },
        ],
      },
      {
        label: 'Product',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
              this.editProduct();
            },
          },

          {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => {
              this.viewProduct();
            },
          },
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            command: () => {
              this.addProduct();
            },
          },
          {
            label: 'Buy request',
            icon: 'pi pi-fw pi-indian-rupee',
            command: () => {
              this.purchaseReq();
            },
          },
        ],
      },

      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-building-columns',
        command: () => {
          this.initial();
        },
      },
      {
        label: 'Feedback',
        icon: 'pi pi-fw pi-comment',
        command: () => {
          this.Feedback();
        },
      },
    ];
  }

  login(): void {
    this.router.navigate(['']);
    localStorage.clear();
  }

  Feedback(): void {
    this.router.navigate(['dashboard/feedback']);
  }

  addUser(): void {
    this.router.navigate(['dashboard/addUser']);
  }

  viewShop(): void {
    this.router.navigate(['dashboard/viewShop']);
  }

  editShop(): void {
    this.router.navigate(['dashboard/editShop']);
  }

  deleteUser(): void {
    this.router.navigate(['dashboard/deleteUser']);
  }

  addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }

  DisableShop(): void {
    this.router.navigate(['dashboard/disableShop']);
  }

  addProduct(): void {
    this.router.navigate(['dashboard/addProduct']);
  }

  viewProduct(): void {
    this.router.navigate(['dashboard/viewProduct']);
  }

  editProduct(): void {
    this.router.navigate(['dashboard/editProduct']);
  }

  initial() {
    this.router.navigate(['dashboard']);
  }

  update() {
    this.router.navigate(['dashboard/updateProfile']);
  }

  ViewUser() {
    this.router.navigate(['dashboard/userList']);
  }

  purchaseReq() {
    this.router.navigate(['dashboard/buyRequest']);
  }
}
