import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ApiResponse<T> {
  status: boolean;
  response: T;
}

@Component({
  selector: 'app-customer-add-subscribtion',
  standalone: true,
  imports: [HttpClientModule, TableModule, ButtonModule, CommonModule],
  templateUrl: './customer-add-subscribtion.component.html',
  styleUrl: './customer-add-subscribtion.component.scss',
})
export class CustomerAddSubscriptionComponent implements OnInit {
  products!: any[];
  Add: any[] = [];

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subscribedShop: any[] = [];

    this.added().subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);
      this.Add = data.data;
      subscribedShop.push(...data.data);
    });

    this.shopDetails().subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);
      const firstArray = data.data;
      this.newKey(subscribedShop, firstArray);
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
    console.log(this.products[0].isSubscribed);
  }

  added(): Observable<ApiResponse<any>> {
    const id = localStorage.getItem('id');
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<any>>(
      `http://localhost:3003/auth/getAll/shop/subscribed/${id}`,
      { headers }
    );
  }

  shopDetails(): Observable<ApiResponse<any>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<any>>(`http://localhost:3003/shop/shops`, {
      headers,
    });
  }

  subscribe(id: any): void {
    this.Subscribe(id).subscribe((ele: ApiResponse<any>) => {
      const data = this.decrypt.decrypt(ele.response);
      data.status ? this.viewSubscriptionRoute() : console.log('nothing');
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
      'http://localhost:3003/auth/customer/subscribe',
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
