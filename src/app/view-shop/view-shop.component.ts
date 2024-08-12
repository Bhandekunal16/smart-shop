import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { header } from '../string';

@Component({
  selector: 'app-view-shop',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-shop.component.html',
  styleUrl: './view-shop.component.scss',
})
export class ViewShopComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}

  public shopName: string | undefined;
  public shopAddress: string | undefined;
  public mobileNumber: string | undefined;
  public email: string | undefined;
  public status: string | undefined;
  public logo: string | undefined;
  public msg: Message[] | any;
  public flag: boolean = true;
  public urls: any[] = [];

  ngOnInit(): void {
    this.flag = false;
    this.details();
  }

  private details() {
    try {
      if (localStorage.getItem('type') == 'MERCHANT') {
        const id = localStorage.getItem('id');
        this.messageHandler(
          'success',
          'Gathering shop information, please wait...'
        );
        this.shopDetails({ id }).subscribe((ele) => {
          const res = this.decrypt.decrypt(ele.response);
          this.messageHandler(
            res.status ? 'success' : 'warn',
            res.status
              ? `Great news! We found the data for ${res.data.shopName}`
              : `Oops! Something went wrong with the data fetch`
          );
          this.flag = true;
          this.shopName = res.data.shopName;
          this.shopAddress = res.data.address;
          this.mobileNumber = res.data.officialContactNo;
          this.email = res.data.officialEmail;
          this.logo = `data:image/webp;base64,${btoa(res.data.logo)}`;

          res.data.disable == false || res.data.disable == null
            ? (this.status = 'Active')
            : (this.status = 'Deactivated');

          setTimeout(() => {
            this.msg = [];
          }, 1000);
        });
        this.shopUrl({ id }).subscribe((ele) => {
          const data = this.decrypt.decrypt(ele.response);
          this.urls = data.data.split('|');
        });
      } else {
        const id = localStorage.getItem('viewShopId');
        this.messageHandler(
          'success',
          'Gathering shop information, please wait...'
        );
        this.shopDetailsNext(id).subscribe((ele) => {
          const res = this.decrypt.decrypt(ele.response);
          this.messageHandler(
            res.status ? 'success' : 'warn',
            res.status
              ? `Great news! We found the data for ${res.data.shopName}`
              : `Oops! Something went wrong with the data fetch`
          );
          this.flag = true;
          this.shopName = res.data.shopName;
          this.shopAddress = res.data.address;
          this.mobileNumber = res.data.officialContactNo;
          this.email = res.data.officialEmail;
          this.logo = `data:image/webp;base64,${btoa(res.data.logo)}`;
          res.data.disable == false || res.data.disable == null
            ? (this.status = 'Active')
            : (this.status = 'Deactivated');
          this.clearMessagesAfterDelay();
        });
      }
    } catch (error) {
      console.error(`localhost error please ignore`);
    }
  }

  public now(input: string) {
    return btoa(input);
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
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

  private shopDetailsNext(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/shopDetails/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopUrl(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/shop/get/url/${id.id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  public addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }
}
