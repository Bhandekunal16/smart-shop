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
    this.messageHandler('info', 'searching for your customer...');
    this.shopCreate();
  }

  private shopCreate() {
    this.shopDetails().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);

      this.products = data.data;

      data.status
        ? this.messageHandler('success', `user found ${data.data.length}`)
        : this.messageHandler('warn', 'something went wrong');

      this.clearMessagesAfterDelay();
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  public edit(id: string): void {
    this.Subscribe(id).subscribe((ele) => {
      const data: any = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.userList();
        this.showButton = true;
      } else {
        this.messageHandler('warn', data.response, 'warn');
        this.showButton = false;
      }
    });
  }

  public unsubscribe(id: string): void {
    this.customerUnsubscribed(id).subscribe((ele) => {
      const data: any = this.decrypt.decrypt(ele.response);

      if (data.status) {
        this.messageHandler('success', `${data.data}`, 'success');

        this.shopDetails().subscribe((ele) => {
          const data: any = this.decrypt.decrypt(ele.response);

          this.products = data.data;

          data.status
            ? this.messageHandler('success', `user found ${data.data.length}`)
            : this.messageHandler('warn', 'something went wrong');

          this.clearMessagesAfterDelay();
        });
      } else {
        this.messageHandler('warn', 'some addition failed.');
      }
    });
  }

  private userList(): void {
    this.router.navigate(['/dashboard/userList']);
  }

  private shopDetails(): Observable<any> {
    const headers = this.header();

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

  private Subscribe(id: string): Observable<any> {
    const headers = this.header();

    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/auth/subscribe',
        {
          id: localStorage.getItem('id'),
          customerId: id,
        },
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

  private customerUnsubscribed(id: string): Observable<any> {
    const headers = this.header();

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

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
