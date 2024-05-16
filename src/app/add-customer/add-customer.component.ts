import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    ButtonModule,
    MessagesModule,
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnInit {
  products!: any[];
  public msg: Message[] | any;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.shopDetails().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
    });
  }

  edit(id: any) {
    console.log(id);
    this.Subscribe(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      console.log(data);
      data.status
        ? this.userList()
        : (this.msg = [
            {
              severity: 'warn',
              summary: 'warn',
              detail: data.response,
            },
          ]);
    });
  }

  shopDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>('http://localhost:3003/auth/getAll/customers', { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  Subscribe(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const MerchantId = localStorage.getItem('id');

    const body = {
      id: MerchantId,
      customerId: id,
    };

    console.log(body);

    return this.http
      .post<any>('http://localhost:3003/auth/subscribe', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  userList(): void {
    this.router.navigate(['/dashboard/userList']);
  }
}
