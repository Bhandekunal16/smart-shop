import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { header } from '../string';

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
  public products!: any[];
  public Add: any[] = [];
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

    this.messageHandler('info', 'searching for subscription');
    this.search();
    this.ui();
  }

  private ui() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  private search() {
    const subscribedShop: any[] = [];

    this.added().subscribe((ele: any) => {
      this.Add = ele.data;
      ele.data ? subscribedShop.push(...ele.data) : subscribedShop.push(...[]);
    });

    this.shopDetails().subscribe((ele: any) => {
      const firstArray = ele.data;
      if (subscribedShop.length > 0) {
        this.newKey(subscribedShop, firstArray);
      } else {
        let newArray = [];

        for (let index = 0; index < ele.data.length; index++) {
          ele.data[index].isSubscribed = false;
          newArray.push(ele.data[index]);
        }

        this.products = newArray;

        this.messageHandler(
          'success',
          `subscription found for ${this.products.length} shop`
        );

        this.clearMessagesAfterDelay();
      }
    });
  }

  private newKey(array1: any[], array2: any[]): void {
    array1.forEach((obj1) => {
      const matchedObj = array2.find(
        (obj2: { id: any }) => obj1.id === obj2.id
      );
      obj1.isSubscribed = !!matchedObj;
    });
    this.products = array1;
    this.products[0].isSubscribed;
  }

  private added(): Observable<ApiResponse<any>> {
    const id = localStorage.getItem('id');
    const headers = header();
    return this.http.get<ApiResponse<any>>(
      `https://smart-shop-api-eta.vercel.app/auth/getAll/shop/subscribed/${id}`,
      { headers }
    );
  }

  private shopDetails(): Observable<ApiResponse<any>> {
    const headers = header();
    return this.http.get<ApiResponse<any>>(
      `https://smart-shop-api-eta.vercel.app/shop/shops`,
      {
        headers,
      }
    );
  }

  public subscribe(id: any): void {
    this.Subscribe(id).subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);

      data.status
        ? this.messageHandler('success', `${data.data}`)
        : this.messageHandler('error', `${data.data}`);

      data.status ? this.viewSubscriptionRoute() : 'nothing';
    });
  }

  public unSubscribe(id: any): void {
    this.unsubscribe(id).subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.messageHandler('success', `${data.data}`);
        this.search();
      } else {
        this.messageHandler('error', `${data.data}`);
      }
    });
  }

  private viewSubscriptionRoute(): void {
    this.router.navigate(['customer-dashboard/viewSubscription']);
  }

  private Subscribe(id: any): Observable<ApiResponse<any>> {
    const headers = header();
    const CustomerId = localStorage.getItem('id');
    const body = { id, customerId: CustomerId };
    return this.http.post<ApiResponse<any>>(
      'https://smart-shop-api-eta.vercel.app/auth/customer/subscribe',
      body,
      { headers }
    );
  }

  private unsubscribe(id: any): Observable<ApiResponse<any>> {
    const headers = header();
    const CustomerId = localStorage.getItem('id');
    const body = { shopId: id, id: CustomerId };
    return this.http.post<ApiResponse<any>>(
      'https://smart-shop-api-eta.vercel.app/auth/customer/unsubscribe',
      body,
      { headers }
    );
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }
}
