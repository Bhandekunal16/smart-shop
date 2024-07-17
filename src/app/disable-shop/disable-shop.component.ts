import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-disable-shop',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonModule, MessagesModule],
  templateUrl: './disable-shop.component.html',
  styleUrl: './disable-shop.component.scss',
})
export class DisableShopComponent implements OnInit {
  public products: any[] = [];
  public msg: Message[] | any;
  constructor(
    private http: HttpClient,
    private decryptService: DecryptService
  ) {}

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');
    this.shopDetails({ id }).subscribe((ele) => {
      const data = this.decryptService.decrypt(ele.response);
      this.products.push(data.data);
    });
  }

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/search', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  trigger() {
    const id = localStorage.getItem('id');
    this.activate({ id }).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop activated successfully!',
        },
      ];

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  trigger2() {
    const id = localStorage.getItem('id');
    this.deactivated({ id }).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop Deactivated successfully!',
        },
      ];

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  activate(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/enable', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deactivated(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/disable', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
