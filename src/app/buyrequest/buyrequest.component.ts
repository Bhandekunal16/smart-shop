import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';
import { Logger } from '../custom.logs';

@Component({
  selector: 'app-buyrequest',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './buyrequest.component.html',
  styleUrl: './buyrequest.component.scss',
})
export class BuyRequestComponent {
  public products: any[] = [];
  public options: string[] | any = ['CASH'];
  public msg: Message[] | any;
  public myForm: FormGroup | any;
  public mode: any;
  public langFlag: boolean | undefined = false;
  public loader: boolean = false;
  constructor(private http: HttpClient) {
    this.myForm = new FormGroup({
      transactionType: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loader = true;
    this.list();
  }

  public list() {
    let id = localStorage.getItem('id');

    this.messageHandler(`info`, 'searching buy request for you');

    this.purchasedList(id).subscribe((ele) => {
      this.products = ele.data;
      this.loader = false;

      if (!ele.status) {
        this.langFlag = true;
      }

      ele.data.length > 0
        ? this.messageHandler(`success`, `request found ${ele.data.length}`)
        : this.messageHandler(`warn`, 'currently you do not have any request');

      this.clearMessagesAfterDelay();
    });
  }

  public getStatusInfo(isPurchased: boolean) {
    return isPurchased
      ? { text: 'Sold', class: 'purchased' }
      : { text: 'Process', class: 'Process' };
  }

  public onPay(userId: any, productId: any) {
    try {
      this.sell({
        custId: userId,
        productId: productId,
        transactionType: this.mode,
      }).subscribe((ele) => {
        new Logger().log(ele);
      });
    } catch (error) {
      new Logger().error(error);
    }
  }

  public onselect(mode: any) {
    this.mode = mode;
  }

  private purchasedList(id: any): Observable<any> {
    const headers = header();

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

  private sell(body: any): Observable<any> {
    const headers = header();

    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/payment/transaction',
        body,
        { headers }
      )
      .pipe(
        catchError((error) => {
          new Logger().error(error);
          return throwError(error);
        })
      );
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }
}
