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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-buyrequest',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    ButtonModule,
    MessagesModule,
    ReactiveFormsModule,
  ],
  templateUrl: './buyrequest.component.html',
  styleUrl: './buyrequest.component.scss',
})
export class BuyRequestComponent {
  products!: any[];
  public options: string[] | any = ['CASH'];
  public msg: Message[] | any;
  public myForm: FormGroup | any;
  public mode: any;
  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private route: Router
  ) {
    this.myForm = new FormGroup({
      transactionType: new FormControl('', [Validators.required]),
    });
  }

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
    console.log(isPurchased);
    if (isPurchased) {
      return { text: 'Sold', class: 'purchased' };
    } else {
      return { text: 'Process', class: 'Process' };
    }
  }

 

  onPay(userId: any, productId: any) {
    console.log(userId, productId);
    const payload = {
      custId: userId,
      productId: productId,
      transactionType: this.mode,
    };
    console.log(payload);

    this.sell(payload).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      console.log(data.data);
    });
  }

  onselect(mode: any) {
    console.log(mode);
    this.mode = mode;
  }

  purchasedList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`http://localhost:3003/payment/purchase/request/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  sell(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/payment/transaction', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
