import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-view-shop',
  standalone: true,
  imports: [CardModule, HttpClientModule, CommonModule, ImageModule],
  templateUrl: './view-shop.component.html',
  styleUrl: './view-shop.component.scss',
})
export class ViewShopComponent implements OnInit {
  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  public shopName: string | undefined;
  public shopAddress: string | undefined;
  public mobileNumber: string | undefined;
  public email: string | undefined;
  public status: string | undefined;
  public logo: string | undefined;

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');

    this.shopDetails({ id }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      this.shopName = res.data.shopName;
      this.shopAddress = res.data.address;
      this.mobileNumber = res.data.officialContactNo;
      this.email = res.data.officialEmail;
      this.logo = res.data.logo;

      res.data.disable == false
        ? (this.status = 'Active')
        : (this.status = 'Deactivated');

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
