import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  products!: any[];
  public msg: Message[] | any;
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.customerSubscribed().subscribe((ele) => {
      this.msg = [
        { severity: 'success', detail: 'searching for your customer...' },
      ];

      const data = this.decrypt.decrypt(ele.response);

      data.status
        ? (this.msg = [
            { severity: 'success', detail: `user found ${data.data.length}` },
          ])
        : (this.msg = [{ severity: 'warn', detail: 'something went wrong' }]);

      this.products = data.data;
    });
  }

  unsubscribe(id: any) {
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

  customerSubscribed(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const id = localStorage.getItem('id');

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

  customerUnsubscribed(id: any): Observable<any> {
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
