import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

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
      this.products = ele.data;

      ele.status
        ? this.messageHandler('success', `user found ${ele.data.length}`)
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
      if (ele.status) {
        this.userList();
        this.showButton = true;
      } else {
        this.messageHandler('warn', ele.response, 'warn');
        this.showButton = false;
      }
    });
  }

  public unsubscribe(id: string): void {
    this.customerUnsubscribed(id).subscribe((ele) => {
      if (ele.status) {
        this.messageHandler('success', `${ele.data}`, 'success');

        this.shopDetails().subscribe((ele) => {
          this.products = ele.data;

          ele.status
            ? this.messageHandler('success', `user found ${ele.data.length}`)
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
    const headers = header();

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
    const headers = header();

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
    const headers = header();

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
