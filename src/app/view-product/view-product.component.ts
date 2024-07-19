import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, timeInterval } from 'rxjs';
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
  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        detail: 'searching product for you!',
      },
    ];
    this.shopDetails().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      this.msg = [
        {
          severity: 'success',
          detail: 'product found for you',
        },
      ];
      this.data = res.data;
      console.log(res.data);

      setInterval(() => {
        this.msg = [];
      }, 1000);
    });
  }

  setCurrentObjectId(id: string) {
    id;
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  convertTimestampToDate(timestamp: any): string {
    console.log(timestamp);
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

  edit(): void {
    this.router.navigate(['dashboard/updateProduct']);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  now(input: string) {
    return `data:image/jpeg;base64,${btoa(input)}`;
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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

  updateProduct() {}
}
