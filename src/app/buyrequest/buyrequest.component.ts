import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-buyrequest',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './buyrequest.component.html',
  styleUrl: './buyrequest.component.scss',
})
export class BuyRequestComponent {
  products!: any[];
  public options: string[] | any = ['CASH'];
  public msg: Message[] | any;
  public myForm: FormGroup | any;
  public mode: any;
  public langFlag: boolean | undefined = false;
  constructor(private http: HttpClient, private decrypt: DecryptService) {
    this.myForm = new FormGroup({
      transactionType: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    let id = localStorage.getItem('id');

    this.msg = [{ severity: `info`, detail: 'searching buy request for you' }];

    this.purchasedList(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;

      data.status ? (this.langFlag = false) : (this.langFlag = true);

      data.data.length > 0
        ? (this.msg = [
            {
              severity: `success`,
              detail: `request found ${data.data.length}`,
            },
          ])
        : (this.msg = [
            {
              severity: `warn`,
              detail: 'currently you do not have any request',
            },
          ]);

      setTimeout(() => {
        this.msg = [];
      }, 500);
    });
  }

  getStatusInfo(isPurchased: boolean): { text: string; class: string } {
     (isPurchased);
    if (isPurchased) {
      return { text: 'Sold', class: 'purchased' };
    } else {
      return { text: 'Process', class: 'Process' };
    }
  }

  onPay(userId: any, productId: any) {
    const payload = {
      custId: userId,
      productId: productId,
      transactionType: this.mode,
    };
     (payload);

    this.sell(payload).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
       (data.data);
    });
  }

  onselect(mode: any) {
     (mode);
    this.mode = mode;
  }

  purchasedList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/payment/purchase/request/${id}`,
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

  sell(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/payment/transaction',
        body,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
