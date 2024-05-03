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
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    ButtonModule,
    MessagesModule,
  ],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  products!: any[];
  public msg: Message[] | any;
  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    this.customerSubscribed().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
    });
  }

  unsubscribe(id: any) {
    this.customerUnsubscribed(id).subscribe((ele) => {
      console.log(ele);
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
        `http://localhost:3003/auth/getAll/customers/subscribed/${id}`,
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
      .get<any>(`http://localhost:3003/auth/unsubscribe/${id}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
