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
  selector: 'app-customer-add-subscribtion',
  standalone: true,
  imports: [HttpClientModule, TableModule, ButtonModule],
  templateUrl: './customer-add-subscribtion.component.html',
  styleUrl: './customer-add-subscribtion.component.scss',
})
export class CustomerAddSubscriptionComponent implements OnInit {
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`http://localhost:3003/shop/shops`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  subscribe(id: any) {
    console.log(id);

    this.Subscribe(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      data.status ? this.viewSubscriptionRoute() : console.log('nothing');
    });
  }

  viewSubscriptionRoute() {
    this.router.navigate(['customer-dashboard/viewSubscription']);
  }

  Subscribe(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const CustomerId = localStorage.getItem('id');

    const body = {
      id: id,
      customerId: CustomerId,
    };

    console.log(body);

    return this.http
      .post<any>('http://localhost:3003/auth/customer/subscribe', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
