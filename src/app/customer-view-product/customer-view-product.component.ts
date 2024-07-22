import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { BlobOptions } from 'buffer';

@Component({
  selector: 'app-customer-view-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-product.component.html',
  styleUrl: './customer-view-product.component.scss',
})
export class CustomerViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  showButton: boolean = false;
  screen: boolean | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {}

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        summary: 'Searching product for you!',
      },
    ];
    this.changer();
    this.search();
  }

  search() {
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
      //  (data);

      this.data = data;

      this.msg = [
        {
          severity: 'success',
          summary: `products found ${this.data.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  now(input: string) {
    return btoa(input);
  }

  changer() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  edit(): void {
    this.router.navigate(['customer-dashboard/updateRating']);
  }

  view(): void {
    this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  setCurrentObjectId(id: string) {
    id;
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  paymentRoute(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.router.navigate(['customer-dashboard/payment']);
  }

  remove(id: any) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };
    this.Remove(body).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      res;

      if (res.status) {
        this.search();
      }
    });
  }

  Remove(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/product/wishlist/remove`,
        id,
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

  shopDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/customer/get`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  WishList(id: string) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };

    this.Add(body).subscribe((ele) => {
      ele;
      let res = this.decrypt.decrypt(ele.response);
      res;
      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'add to wish list',
          },
        ];
        this.view();
        this.showButton = false;
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: res.response,
          },
        ];
        this.showButton = true;
      }
    });
  }

  Add(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(`https://smart-shop-api-eta.vercel.app/product/wishlist`, id, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
