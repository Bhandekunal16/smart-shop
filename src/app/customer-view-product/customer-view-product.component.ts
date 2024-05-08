import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-customer-view-product',
  standalone: true,
  imports: [
    HttpClientModule,
    CardModule,
    CommonModule,
    ButtonModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './customer-view-product.component.html',
  styleUrl: './customer-view-product.component.scss',
})
export class CustomerViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {}

  ngOnInit(): void {
    this.shopDetails().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      const updatedShops = res.data.map((shop: any) => {
        const updatedProducts = shop.products.map((product: any) => ({
          ...product,
          shopName: shop.shopName,
        }));

        return {
          products: updatedProducts,
        };
      });

      let array = [];
      for (let index = 0; index < 1; index++) {
        const product = updatedShops;

        for (let index = 0; index < product.length; index++) {
          const element = product[index].products;
          array.push(element);
        }
      }

      const data = array.reduce((acc, arr) => [...acc, ...arr], []);
      // console.log(data);

      this.data = data;
    });
  }

  setCurrentObjectId(id: string) {
    console.log(id);
    localStorage.setItem('currentObjectId', id);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  shopDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`http://localhost:3003/product/customer/get`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
