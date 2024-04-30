import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenubarModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Shop',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Information',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Edit',
                icon: 'pi pi-fw pi-bookmark',
                command: () => this.editShop(),
              },
              {
                label: 'View',
                icon: 'pi pi-fw pi-video',
                command: () => this.viewShop(),
              },
              {
                label: 'Disable',
                icon: 'pi pi-fw pi-video',
                command: () => this.DisableShop(),
              },
            ],
          },
          {
            label: 'Add',
            icon: 'pi pi-fw pi-video',
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
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus',
            command: () => {
              this.deleteUser();
            },
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print',
                  },
                ],
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List',
              },
            ],
          },
        ],
      },
      {
        label: 'Product',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Operation',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Edit',
                icon: 'pi pi-fw pi-calendar-plus',
                command: () => {
                  this.editProduct();
                },
              },

              {
                label: 'View',
                icon: 'pi pi-fw pi-calendar-minus',
                command: () => {
                  this.viewProduct();
                },
              },
            ],
          },
          {
            label: 'Upload',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'New',
                icon: 'pi pi-fw pi-calendar-minus',
                command: () => {
                  this.addProduct();
                },
              },
            ],
          },
        ],
      },
      {
        label: 'Quit',
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
}
