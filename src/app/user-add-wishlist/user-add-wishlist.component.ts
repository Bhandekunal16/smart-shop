import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-user-add-wishlist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-add-wishlist.component.html',
  styleUrl: './user-add-wishlist.component.scss',
})
export class UserAddWishlistComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public showButton: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {}

  ngOnInit(): void {
    this.search();
  }

  private search() {
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
      this.data = data;
    });
  }

  private view(): void {
    const userType = localStorage.getItem('type');
    userType == 'MERCHANT'
      ? this.router.navigate(['dashboard/userViewWishList'])
      : this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  public now(input: string) {
    return `data:image/webp;base64,${btoa(input)}`;
  }

  public setCurrentObjectId(id: string) {
    this.Add({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      if (res.status) {
        this.messageHandler('success', 'add to wish list');
        this.view();
        this.showButton = false;
      } else {
        this.messageHandler('warn', res.response);
        this.showButton = true;
      }
      this.clearMessagesAfterDelay();
    });
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public remove(id: any) {
    this.Remove({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      if (res.status) {
        this.search();
      }
    });
  }

  private shopDetails(): Observable<any> {
    const headers = this.header();
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

  private Add(id: any): Observable<any> {
    const headers = this.header();
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

  private Remove(id: any): Observable<any> {
    const headers = this.header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
