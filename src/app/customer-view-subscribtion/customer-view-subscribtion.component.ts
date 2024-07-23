import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-customer-view-subscribtion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-subscribtion.component.html',
  styleUrl: './customer-view-subscribtion.component.scss',
})
export class CustomerViewSubscriptionComponent implements OnInit {
  products!: any[];
  public msg: Message[] | any;
  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        summary: 'searching for subscription',
      },
    ];

    this.shopDetails().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;

      this.msg = [
        {
          severity: 'success',
          summary: `shop found ${this.products.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/getAll/shop/subscribed/${id}`,
        {
          headers,
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
