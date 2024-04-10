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
              },
              {
                label: 'View',
                icon: 'pi pi-fw pi-video',
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
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus',
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

  deleteUser(): void {
    this.router.navigate(['dashboard/deleteUser']);
  }

  addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }
}
