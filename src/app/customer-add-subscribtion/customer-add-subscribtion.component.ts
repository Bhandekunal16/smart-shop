import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';

interface ApiResponse<T> {
  status: boolean;
  response: T;
}

@Component({
  selector: 'app-customer-add-subscribtion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-add-subscribtion.component.html',
  styleUrl: './customer-add-subscribtion.component.scss',
})
export class CustomerAddSubscriptionComponent implements OnInit {
  products!: any[];
  Add: any[] = [];
  public msg: Message[] | any;
  public flag: boolean | any;
  public screen: boolean | undefined;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router,
    private statusService: StateService
  ) {}

  ngOnInit(): void {
    this.statusService.status$.subscribe((status) => {
      this.flag = status;
    });
    this.msg = [
      {
        severity: 'info',
        summary: 'searching for subscription',
      },
    ];
    this.search();

    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  search() {
    const subscribedShop: any[] = [];

    this.added().subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);
      this.Add = data.data;
      data.data
        ? subscribedShop.push(...data.data)
        : subscribedShop.push(...[]);
    });

    this.shopDetails().subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);
      const firstArray = data.data;
      if (subscribedShop.length > 0) {
        this.newKey(subscribedShop, firstArray);
      } else {
        let newArray = [];

        for (let index = 0; index < data.data.length; index++) {
          data.data[index].isSubscribed = false;
          newArray.push(data.data[index]);
        }

        this.products = newArray;

        this.msg = [
          {
            severity: 'success',
            summary: `subscription found for ${this.products.length} shop`,
          },
        ];

        setTimeout(() => {
          this.msg = [];
        }, 1000);
      }
    });
  }

  newKey(array1: any[], array2: any[]): void {
    array1.forEach((obj1) => {
      const matchedObj = array2.find(
        (obj2: { id: any }) => obj1.id === obj2.id
      );
      obj1.isSubscribed = !!matchedObj;
    });
    this.products = array1;
    this.products[0].isSubscribed;
  }

  added(): Observable<ApiResponse<any>> {
    const id = localStorage.getItem('id');
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<any>>(
      `https://smart-shop-api-eta.vercel.app/auth/getAll/shop/subscribed/${id}`,
      { headers }
    );
  }

  shopDetails(): Observable<ApiResponse<any>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<any>>(
      `https://smart-shop-api-eta.vercel.app/shop/shops`,
      {
        headers,
      }
    );
  }

  subscribe(id: any): void {
    this.Subscribe(id).subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: `${data.data}`,
          },
        ];
      } else {
        this.msg = [
          {
            severity: 'error',
            summary: 'error',
            detail: `${data.data}`,
          },
        ];
      }

      data.status ? this.viewSubscriptionRoute() : 'nothing';
    });
  }

  unSubscribe(id: any): void {
    this.unsubscribe(id).subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: `${data.data}`,
          },
        ];
        this.search();
      } else {
        this.msg = [
          {
            severity: 'error',
            summary: 'error',
            detail: `${data.data}`,
          },
        ];
      }
    });
  }

  viewSubscriptionRoute(): void {
    this.router.navigate(['customer-dashboard/viewSubscription']);
  }

  Subscribe(id: any): Observable<ApiResponse<any>> {
    const headers = this.getHeaders();
    const CustomerId = localStorage.getItem('id');
    const body = { id, customerId: CustomerId };
    return this.http.post<ApiResponse<any>>(
      'https://smart-shop-api-eta.vercel.app/auth/customer/subscribe',
      body,
      { headers }
    );
  }

  unsubscribe(id: any): Observable<ApiResponse<any>> {
    const headers = this.getHeaders();
    const CustomerId = localStorage.getItem('id');
    const body = { shopId: id, id: CustomerId };
    return this.http.post<ApiResponse<any>>(
      'https://smart-shop-api-eta.vercel.app/auth/customer/unsubscribe',
      body,
      { headers }
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
