import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-disable-shop',
  standalone: true,
  imports: [SharedModule],
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
    try {
      const id = localStorage.getItem('id');

      this.msg = [
        { severity: 'info', detail: 'searching for the shop details' },
      ];

      this.shopDetails({ id }).subscribe((ele) => {
        this.products = [];
        const data = this.decryptService.decrypt(ele.response);
        this.products.push(data.data);

        this.msg = [
          {
            severity: 'success',
            detail: `shop details fetched for the ${data.data.shopName}`,
          },
        ];

        setTimeout(() => {
          this.msg = [];
        }, 1000);
      });
    } catch (error) {
      ('some thing found with localhost');
    }
  }

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/search', body, {
        headers,
      })
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

      this.details();
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

      this.details();
    });
  }

  activate(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/enable', body, {
        headers,
      })
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
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/disable', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
