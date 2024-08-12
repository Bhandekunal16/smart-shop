import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-user-view-wishlist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-view-wishlist.component.html',
  styleUrl: './user-view-wishlist.component.scss',
})
export class UserViewWishlistComponent {
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}
  products!: any[];
  public msg: Message[] | any;

  ngOnInit(): void {
    this.messageHandler('info', 'Searching for your wish list!');
    this.details();
  }

  private details() {
    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      this.messageHandler(
        'success',
        `found items from your wish list ${this.products.length}`
      );
      this.clearMessagesAfterDelay();
    });
  }

  remove(id: any) {
    this.Remove({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      if (res.status) {
        this.details();
      }
    });
  }

  public submit() {
    this.add();
  }

  private add(): void {
    const userType = localStorage.getItem('type');
    userType == 'MERCHANT'
      ? this.router.navigate(['dashboard/userAddWishList'])
      : this.router.navigate(['customer-dashboard/userAddWishList']);
  }

  private shopDetails(id: any): Observable<any> {
    const headers = this.header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/product/get/wishlist/${id}`,
        { headers }
      )
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
