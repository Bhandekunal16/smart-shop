import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  public products!: any[];
  public msg: Message[] | any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    try {
      this.messageHandler('info', 'searching for your customer...');
      const id = localStorage.getItem('id');
      this.customerSubscribed(id).subscribe((ele) => {
        this.products = ele.data;
        ele.status
          ? this.messageHandler('success', `user found ${ele.data.length}`)
          : this.messageHandler('warn', 'something went wrong');
        this.clearMessagesAfterDelay();
      });
    } catch (error) {
      ('issue of the localhost');
    }
  }

  public unsubscribe(id: any) {
    this.customerUnsubscribed(id).subscribe((ele) => {
      ele.status
        ? this.messageHandler('success', `${ele.data}`)
        : this.messageHandler('warn', `${ele.data}`);
    });
  }

  private customerSubscribed(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/getAll/customers/subscribed/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private customerUnsubscribed(id: any): Observable<any> {
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
