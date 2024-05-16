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
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyrequest',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    ButtonModule,
    MessagesModule,
  ],
  templateUrl: './buyrequest.component.html',
  styleUrl: './buyrequest.component.scss',
})
export class BuyRequestComponent {
  products!: any[];
  public msg: Message[] | any;
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list() {
    let id = localStorage.getItem('id');

    this.purchasedList(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      console.log(data);
    });
  }

  getStatusInfo(isPurchased: boolean): { text: string; class: string } {
    if (isPurchased) {
      return { text: 'Purchased', class: 'purchased' };
    } else {
      return { text: 'Process', class: 'Process' };
    }
  }

  purchasedList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`http://localhost:3003/payment/purchase/request/${id}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
