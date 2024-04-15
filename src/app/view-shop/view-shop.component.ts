import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-view-shop',
  standalone: true,
  imports: [CardModule, HttpClientModule, CommonModule],
  templateUrl: './view-shop.component.html',
  styleUrl: './view-shop.component.scss',
})
export class ViewShopComponent implements OnInit {
  constructor(private http: HttpClient) {}

  public shopName: string | undefined;
  public shopAddress: string | undefined;
  public mobileNumber: string | undefined;
  public email: string | undefined;
  public status: string | undefined;

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');

    this.shopDetails({ id }).subscribe((ele) => {
      console.log(ele);
      this.shopName = ele.data.shopName;
      this.shopAddress = ele.data.address;
      this.mobileNumber = ele.data.officialContactNo;
      this.email = ele.data.officialEmail;

      ele.data.disable == false
        ? (this.status = 'Activate')
        : (this.status = 'Deactivate');

      console.log(this.shopName);
    });
  }

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/shop/search', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
