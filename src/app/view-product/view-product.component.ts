import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
  providers: [DatePipe],
})
export class ViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public flag: boolean = true;
  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {}

  ngOnInit(): void {
    this.messageHandler('info', 'searching product for you!');
    this.shopDetails().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      this.flag = false;

      this.messageHandler(
        'success',
        'you currently not have anything in the shop'
      );

      if (res.status) {
        this.data = res.data;
        this.flag = true;
        this.messageHandler(
          'success',
          `product found for you ${res.data.length}`
        );
        this.clearMessagesAfterDelay();
      }
    });
  }

  public setCurrentObjectId(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.edit();
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
    const headers = this.header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private edit(): void {
    this.router.navigate(['dashboard/updateProduct']);
  }
}
