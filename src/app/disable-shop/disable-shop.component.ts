import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-disable-shop',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonModule],
  templateUrl: './disable-shop.component.html',
  styleUrl: './disable-shop.component.scss',
})
export class DisableShopComponent implements OnInit {
  public products: any[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');
    this.shopDetails({ id }).subscribe((ele) => {
      this.products.push(ele.data);
      console.log(this.products);
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
