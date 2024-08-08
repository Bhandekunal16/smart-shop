import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  public product: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public showButton: boolean = false;
  public screen: boolean | undefined;
  public flag: boolean | any = true;
  public skip: number = 0;
  public limit: number = 10;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flag = false;
    this.msg = [
      {
        severity: 'info',
        detail: 'searching products for you !',
      },
    ];

    this.shopDetail();

    this.changer();
  }

  shopDetail() {
    const id: string | null = localStorage.getItem('id');
    this.shopDetails({ id, skip: this.skip, limit: this.limit }).subscribe(
      (res) => {
        const data: any = this.decrypt.decrypt(res.response);

        if (data.status) {
          this.product = data.data;
          this.flag = true;
          this.msg = [
            {
              severity: 'success',
              detail: `product found ${data.data.length}`,
            },
          ];

          setTimeout(() => {
            this.msg = [];
          }, 1000);
        }
      }
    );
  }

  add() {
    this.skip += 10;
    this.flag = false;
    this.msg = [
      {
        severity: 'info',
        detail: 'searching products for you !',
      },
    ];
    this.shopDetail();
  }

  clearSelection() {
    this.skip = 0;
    this.flag = false;
    this.msg = [
      {
        severity: 'info',
        detail: 'searching products for you !',
      },
    ];
    this.shopDetail();
  }

  decries() {
    this.skip == 0 ? 0 : (this.skip -= 10);
    this.flag = false;
    this.msg = [
      {
        severity: 'info',
        detail: 'searching products for you !',
      },
    ];
    this.shopDetail();
  }

  now(input: string) {
    return btoa(input);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  private shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/products`,
        body,
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

  changer() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  WishList(id: string) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };

    this.AddToWishList(body).subscribe((ele) => {
      let res = this.decrypt.decrypt(ele.response);
      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'add to wish list',
          },
        ];
        this.shopDetail();
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

  remove(id: any) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };
    this.RemoveFromWishlist(body).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      if (res.status) {
        this.shopDetail();
      }
    });
  }

  paymentRoute(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.router.navigate(['dashboard/payment']);
  }

  AddToWishList(id: any): Observable<any> {
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

  RemoveFromWishlist(id: any): Observable<any> {
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
}
