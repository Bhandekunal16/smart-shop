import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { header } from '../string';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.flag = false;
    this.messageHandler('info', 'searching products for you !');
    this.shopDetail();
    this.changer();
  }

  public shopDetail() {
    const id: string | null = localStorage.getItem('id');
    this.shopDetails({ id, skip: this.skip, limit: this.limit }).subscribe(
      (res) => {
        if (res.status) {
          this.product = res.data;
          this.flag = true;
          this.messageHandler('success', `product found ${res.data.length}`);
          this.clearMessagesAfterDelay();
        }
      }
    );
  }

  public add() {
    this.skip += 10;
    this.flag = false;
    this.messageHandler('info', 'searching products for you !');
    this.shopDetail();
  }

  public clearSelection() {
    this.skip = 0;
    this.flag = false;
    this.messageHandler('info', 'searching products for you !');
    this.shopDetail();
  }

  public decries() {
    this.skip == 0 ? 0 : (this.skip -= 10);
    this.flag = false;
    this.messageHandler('info', 'searching products for you !');
    this.shopDetail();
  }

  public WishList(id: string) {
    this.AddToWishList({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      if (ele.status) {
        this.messageHandler('success', 'add to wish list');
        this.shopDetail();
        this.showButton = false;
        this.clearMessagesAfterDelay();
      } else {
        this.messageHandler('warn', ele.response);
        this.showButton = true;
        this.clearMessagesAfterDelay();
      }
    });
  }

  public remove(id: any) {
    this.RemoveFromWishlist({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      if (ele.status) {
        this.shopDetail();
        this.clearMessagesAfterDelay();
      }
    });
  }

  public now(input: string) {
    return btoa(input);
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public paymentRoute(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.router.navigate(['dashboard/payment']);
  }

  private changer() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
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

  private AddToWishList(id: any): Observable<any> {
    const headers = header();
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

  private RemoveFromWishlist(id: any): Observable<any> {
    const headers = header();
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
