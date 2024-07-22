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
    this.msg = [
      {
        severity: 'info',
        summary: 'Searching for your wish list!',
      },
    ];
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      this.msg = [
        {
          severity: 'success',
          summary: `found items from your wish list ${this.products.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 500);
    });
  }

  remove(id: any) {
    id;
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };
    this.Remove(body).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      res;

      if (res.status) {
        this.details();
      }
    });
  }

  submit() {
    this.add();
  }

  add(): void {
    this.router.navigate(['customer-dashboard/userAddWishList']);
  }

  shopDetails(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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
}
