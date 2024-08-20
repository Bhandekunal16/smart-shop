import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { header } from '../string';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-view-subscribtion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-subscribtion.component.html',
  styleUrl: './customer-view-subscribtion.component.scss',
})
export class CustomerViewSubscriptionComponent implements OnInit {
  public products!: any[];
  public msg: Message[] | any;
  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit(): void {
    this.messageHandler('info', `searching for subscription`);
    this.shopDetails().subscribe((ele) => {
      this.products = ele.data;
      this.messageHandler('success', `shop found ${this.products.length}`);
      this.clearMessagesAfterDelay();
    });
  }

  private shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = header();
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  public addSubscription(): void {
    this.route.navigate(['customer-dashboard/addSubscription']);
  }
}
