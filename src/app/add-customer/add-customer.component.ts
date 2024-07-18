import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnInit {
  public products!: any[];
  public msg: Message[] | any;
  public showButton: boolean = false;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.msg = [{ severity: 'info', detail: 'searching for your customer...' }];
    this.shopDetails().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);

      data.status
        ? (this.msg = [
            { severity: 'success', detail: `user found ${data.data.length}` },
          ])
        : (this.msg = [{ severity: 'warn', detail: 'something went wrong' }]);

      setTimeout(() => {
        this.msg = [];
      }, 100);

      this.products = data.data;
    });
  }

  private userList(): void {
    this.router.navigate(['/dashboard/userList']);
  }

  public edit(id: any) {
    this.Subscribe(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      if (data.status) {
        this.userList();
        this.showButton = true;
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: data.response,
          },
        ];
        this.showButton = false;
      }
    });
  }

  public unsubscribe(id: any) {
    this.customerUnsubscribed(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: `${data.data}`,
          },
        ];
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'some addition failed.',
          },
        ];
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  private shopDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>('https://smart-shop-api-eta.vercel.app/auth/getAll/customers', {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private Subscribe(id: any): Observable<any> {
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
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/subscribe', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private customerUnsubscribed(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/unsubscribe/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
