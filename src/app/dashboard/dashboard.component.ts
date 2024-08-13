import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NetworkStatusService } from '../network-status.service';
import { StateService } from '../state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { header } from '../string';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public items: MenuItem[] | undefined;
  public onlineStatus: boolean = true;
  public deferredPrompt: any;
  public visible: boolean = false;
  public Log: any;
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
      this.profileImage = `data:image/webp;base64,${btoa(res.data)}`;
    });
  }

  private updateMenuItems(status: boolean) {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-building-columns',
        command: () => {
          this.initial();
        },
      },
      {
        label: 'Feed',
        icon: 'pi pi-box',
        command: () => {
          this.feed();
        },
      },
      {
        label: 'Shop',
        icon: 'pi pi-shop',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-user-edit',
            command: () => this.editShop(),
          },
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => this.viewShop(),
          },
          {
            label: 'Add',
            icon: 'pi pi-cart-plus',
            command: () => this.addShop(),
          },
        ],
      },
      {
        label: 'Product',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              this.viewProduct();
            },
          },
          {
            label: 'New',
            icon: 'pi pi-plus',
            command: () => {
              this.addProduct();
            },
          },
          {
            label: 'Buy request',
            icon: 'pi pi-indian-rupee',
            command: () => {
              this.purchaseReq();
            },
          },
        ],
      },
      {
        label: 'Users',
        icon: 'pi pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-user-plus',
            command: () => {
              this.addUser();
            },
          },

          {
            label: 'customer-list',
            icon: 'pi pi-list',
            command: () => {
              this.ViewUser();
            },
          },
        ],
      },

      {
        label: 'Feedback',
        icon: 'pi pi-comment',
        command: () => {
          this.Feedback();
        },
      },
      {
        label: `${localStorage.getItem('username')}`,
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
              this.update();
            },
          },
          {
            label: status ? 'Account Enabled' : 'Account Disabled',
            icon: status ? 'pi pi-unlock' : 'pi pi-lock',
            iconStyle: status ? { color: 'green' } : { color: 'red' },
          },
          {
            label: this.onlineStatus ? 'Online' : 'Offline',
            icon: this.onlineStatus ? 'pi pi-wifi' : 'pi pi-globe',
            iconStyle: this.onlineStatus
              ? { color: 'green' }
              : { color: 'red' },
          },
          {
            label: 'Share',
            icon: 'pi pi-share-alt',
            command: () => {
              this.share();
            },
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-list-check',
            command: () => {
              this.wishList();
            },
          },
          {
            label: 'Quit',
            icon: 'pi pi-power-off',
            command: () => {
              this.login();
            },
          },
        ],
      },
    ];
  }

  public date() {
    this.visible = true;
    const data: any = localStorage.getItem('lastLogin');
    this.Log = new Date(parseInt(data)).toISOString();
    this.LogRester();
  }

  private shopDetails(id: any): Observable<any> {
    const headers = header();

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

  private login(): void {
    this.router.navigate(['']);
    localStorage.clear();
  }

  private Feedback(): void {
    this.router.navigate(['dashboard/feedback']);
  }

  private addUser(): void {
    this.router.navigate(['dashboard/addUser']);
  }

  private viewShop(): void {
    this.router.navigate(['dashboard/viewShop']);
  }

  private editShop(): void {
    this.router.navigate(['dashboard/editShop']);
  }

  private deleteUser(): void {
    this.router.navigate(['dashboard/deleteUser']);
  }

  private addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }

  private addProduct(): void {
    this.router.navigate(['dashboard/addProduct']);
  }

  private viewProduct(): void {
    this.router.navigate(['dashboard/viewProduct']);
  }

  private initial(): void {
    this.router.navigate(['dashboard']);
  }

  private update(): void {
    this.router.navigate(['dashboard/updateProfile']);
  }

  private ViewUser(): void {
    this.router.navigate(['dashboard/userList']);
  }

  private purchaseReq(): void {
    this.router.navigate(['dashboard/buyRequest']);
  }

  private share(): void {
    this.router.navigate(['dashboard/share']);
  }

  private feed(): void {
    this.router.navigate(['dashboard/feed']);
  }

  private wishList(): void {
    this.router.navigate(['dashboard/userViewWishList']);
  }

  private LogRester() {
    setInterval(() => {
      this.Log = null;
    }, 10000);
  }
}
