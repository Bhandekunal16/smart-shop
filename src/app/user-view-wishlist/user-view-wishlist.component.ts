import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-view-wishlist',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonModule, TableModule],
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

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe((ele) => {
      console.log(ele);
      const data = this.decrypt.decrypt(ele.response);
      console.log(data.data);
      this.products = data.data;
    });
  }

  remove(id: any) {
    console.log(id);
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };
    this.Remove(body).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      console.log(res);
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
      .get<any>(`http://localhost:3003/product/get/wishlist/${id}`, { headers })
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
      .post<any>(`http://localhost:3003/product/wishlist/remove`, id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
