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

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [HttpClientModule, CardModule, CommonModule, ButtonModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
  public data: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.shopDetails().subscribe((ele) => {
      this.data = ele.data;
      console.log(this.data);
    });
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    console.log(id, 'i am hitting');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`http://localhost:3003/product/getall/${id}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateProduct() {}
}
