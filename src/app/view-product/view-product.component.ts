import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { header } from '../string';
import { UpdateProductComponent } from '../update-product/update-product.component';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [SharedModule, UpdateProductComponent],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
  providers: [DatePipe],
})
export class ViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public flag: boolean = true;
  public visible: boolean = false;
  public product!: any[];
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.messageHandler('info', 'searching product for you!');
    this.flag = false;
    this.shopDetails().subscribe((ele) => {
      this.messageHandler(
        'success',
        'you currently not have anything in the shop'
      );

      if (ele.status) {
        this.data = ele.data;
        this.flag = true;
        this.messageHandler(
          'success',
          `product found for you ${ele.data.length}`
        );
        this.clearMessagesAfterDelay();
      }
    });
  }

  public setCurrentObjectId(id: string) {
    this.Details(id).subscribe((ele) => {
      this.product = [ele.data];
      this.visible = true;
    });
  }

  public onFlagChanged(flag: boolean) {
    console.log('Flag received from child:', flag);

    if (flag) {
      this.messageHandler('info', 'searching product for you!');
      this.flag = false;
      this.shopDetails().subscribe((ele) => {
        this.messageHandler(
          'success',
          'you currently not have anything in the shop'
        );

        if (ele.status) {
          this.data = ele.data;
          this.flag = true;
          this.messageHandler(
            'success',
            `product found for you ${ele.data.length}`
          );
          this.clearMessagesAfterDelay();
        }
      });
    }
  }

  public convertTimestampToDate(timestamp: any): string {
    const date = new Date(parseInt(timestamp));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public now(input: string) {
    return `data:image/webp;base64,${btoa(input)}`;
  }

  private shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/getall/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private Details(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/get/${id}`, {
        headers,
      })
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
