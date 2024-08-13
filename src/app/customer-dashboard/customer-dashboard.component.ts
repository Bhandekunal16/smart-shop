import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { NetworkStatusService } from '../network-status.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  public items: MenuItem[] | undefined;
  public onlineStatus: boolean = true;
  public visible: boolean = false;
  public Log: any;
  public profileImage: string | any;

  constructor(
    private router: Router,
    private statusService: StateService,
    private networkStatusService: NetworkStatusService,
    private http: HttpClient
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

    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe(async (res) => {
      this.profileImage = `data:image/webp;base64,${btoa(res.data)}`;
    });
  }

  private updateMenuItems(status: boolean) {
    this.items = [
      {
        label: `${localStorage.getItem('username')}`,
        icon: 'pi pi-user',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              this.profile();
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
            label: 'Log-out',
            icon: 'pi pi-power-off',
            command: () => {
              this.login();
            },
          },
        ],
      },
      {
        label: 'Inventory',
        icon: 'pi pi-pencil',
        items: [
          {
            label: 'ProductList',
            icon: 'pi pi-list',
            command: () => {
              this.initial();
            },
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-list-check',
            command: () => {
              this.WishList();
            },
          },
          {
            label: 'Purchases',
            icon: 'pi pi-receipt',
            command: () => {
              this.list();
            },
          },
        ],
      },
      {
        label: 'Subscriptions',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              this.viewSubscriptionRoute();
            },
          },
          {
            label: 'Add',
            icon: 'pi pi-plus',
            command: () => {
              this.addSubscription();
            },
          },
        ],
      },
      {
        label: 'Feedback',
        icon: 'pi pi-comment',
        command: () => {
          this.feedback();
        },
      },
    ];
  }

  private login(): void {
    this.router.navigate(['']);
  }

  private addSubscription(): void {
    this.router.navigate(['customer-dashboard/addSubscription']);
  }

  private initial() {
    this.router.navigate(['customer-dashboard']);
  }

  private WishList() {
    this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  private profile() {
    this.router.navigate(['customer-dashboard/profile']);
  }

  private viewSubscriptionRoute() {
    this.router.navigate(['customer-dashboard/viewSubscription']);
  }

  private feedback() {
    this.router.navigate(['customer-dashboard/feedback']);
  }

  private list() {
    this.router.navigate(['customer-dashboard/purchasedList']);
  }

  private share() {
    this.router.navigate(['customer-dashboard/share']);
  }

  public date() {
    this.visible = true;
    const data: any = localStorage.getItem('lastLogin');
    this.Log = new Date(parseInt(data)).toISOString();
    this.clearLog();
  }

  public shopDetails(id: any): Observable<any> {
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

  private clearLog() {
    setInterval(() => {
      this.Log = null;
    }, 10000);
  }
}
