import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-view-subscribtion',
  standalone: true,
  imports: [HttpClientModule, TableModule, ButtonModule],
  templateUrl: './customer-view-subscribtion.component.html',
  styleUrl: './customer-view-subscribtion.component.scss',
})
export class CustomerViewSubscriptionComponent implements OnInit {
  products!: any[];
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopDetails().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      console.log(data);
    });
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`http://localhost:3003/auth/getAll/shop/subscribed/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
