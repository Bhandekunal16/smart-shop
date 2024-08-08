import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NetworkStatusService } from '../network-status.service';
import { StateService } from '../state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

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
  deferredPrompt: any;
  visible: boolean = false;
  Log: any;
  public profileImage: string | any;

  constructor(
    private router: Router,
    private statusService: StateService,
    private networkStatusService: NetworkStatusService,
    private http: HttpClient,
    private decrypt: DecryptService
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

    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe(async (res) => {
      const data = await this.decrypt.decrypt(res.response);
      this.profileImage = `data:image/webp;base64,${btoa(data.data)}`;
    });
  }

  updateMenuItems(status: boolean) {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-building-columns',
        command: () => {
          this.initial();
        },
      },
      {
        label: 'feed',
        icon: 'pi pi-fw pi-box',
        command: () => {
          this.feed();
        },
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
            label: 'Add',
            icon: 'pi pi-fw pi-cart-plus',
            command: () => this.addShop(),
          },
        ],
      },
      {
        label: 'Product',
        icon: 'pi pi-fw pi-calendar',
        items: [
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
        label: 'Feedback',
        icon: 'pi pi-fw pi-comment',
        command: () => {
          this.Feedback();
        },
      },
      {
        label: `${localStorage.getItem('username')}`,
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
            iconStyle: status ? { color: 'green' } : { color: 'red' },
          },
          {
            label: this.onlineStatus ? 'Online' : 'Offline',
            icon: this.onlineStatus ? 'pi pi-fw pi-wifi' : 'pi pi-fw pi-globe',
            iconStyle: this.onlineStatus
              ? { color: 'green' }
              : { color: 'red' },
          },
          {
            label: 'Share',
            icon: 'pi pi-fw pi-share-alt',
            command: () => {
              this.share();
            },
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-fw pi-list-check',
            command: () => {
              this.wishList();
            },
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

  addProduct(): void {
    this.router.navigate(['dashboard/addProduct']);
  }

  viewProduct(): void {
    this.router.navigate(['dashboard/viewProduct']);
  }

  initial(): void {
    this.router.navigate(['dashboard']);
  }

  update(): void {
    this.router.navigate(['dashboard/updateProfile']);
  }

  ViewUser(): void {
    this.router.navigate(['dashboard/userList']);
  }

  purchaseReq(): void {
    this.router.navigate(['dashboard/buyRequest']);
  }

  share(): void {
    this.router.navigate(['dashboard/share']);
  }

  feed(): void {
    this.router.navigate(['dashboard/feed']);
  }

  wishList(): void {
    this.router.navigate(['dashboard/userViewWishList']);
  }

  date() {
    this.visible = true;
    const data: any = localStorage.getItem('lastLogin');
    this.Log = new Date(parseInt(data)).toISOString();

    setInterval(() => {
      this.Log = null;
    }, 10000);
  }

  shopDetails(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/profile/image/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
