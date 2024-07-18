import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [
    HttpClientModule,
    CardModule,
    CommonModule,
    ButtonModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
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
      this.data = res.data;
      console.log(this.data);
    });
  }

  setCurrentObjectId(id: string) {
    console.log(id);
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  edit(): void {
    this.router.navigate(['dashboard/updateProduct']);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/getall/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateProduct() {}
}
