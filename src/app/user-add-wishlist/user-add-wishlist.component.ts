import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { header, options } from '../string';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-add-wishlist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-add-wishlist.component.html',
  styleUrl: './user-add-wishlist.component.scss',
})
export class UserAddWishlistComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public myForm: FormGroup | any;
  public loader: boolean = true;
  public skip: number = 0;
  public limit: number = 10;
  public selectedValue: string | undefined;
  public options: string[] | any = options;
  public Filter: string | undefined;
  public showButton: boolean = false;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.search();
  }

  private search() {
    this.shopDetails({ skip: 0, limit: 10 }).subscribe((ele) => {
      const data = ele.data;
      this.data = data;
    });
  }

  public add() {
    this.skip += 10;
    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      filter: this.Filter,
    }).subscribe((ele) => {
      this.loader = true;
      this.data = ele.data;
      this.messageHandler('success', `products found ${this.data.length}`);
      this.clearMessagesAfterDelay();
    });
  }

  public decries() {
    this.skip == 0 ? 0 : (this.skip -= 10);
    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      filter: this.Filter,
    }).subscribe((ele) => {
      this.loader = true;
      this.data = ele.data;
      this.messageHandler('success', `products found ${this.data.length}`);
      this.clearMessagesAfterDelay();
    });
  }

  public selectItem(event: Event) {
    this.loader = false;
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.Filter = selectedValue;

    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      filter: selectedValue,
    }).subscribe((ele) => {
      this.loader = true;
      this.data = ele.data;
      this.messageHandler('success', `products found ${this.data.length}`);
      this.clearMessagesAfterDelay();
    });
  }

  public clearSelection() {
    this.myForm.get('productType')?.setValue('');
    this.selectedValue = '';
    this.Filter = '';
    this.skip = 0;
    this.search();
  }

  private view(): void {
    const userType = localStorage.getItem('type');
    userType == 'MERCHANT'
      ? this.router.navigate(['dashboard/userViewWishList'])
      : this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  public now(input: string) {
    return `data:image/webp;base64,${btoa(input)}`;
  }

  public setCurrentObjectId(id: string) {
    this.Add({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      if (ele.status) {
        this.messageHandler('success', 'add to wish list');
        this.view();
        this.showButton = false;
      } else {
        this.messageHandler('warn', ele.response);
        this.showButton = true;
      }
      this.clearMessagesAfterDelay();
    });
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public remove(id: any) {
    this.Remove({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      if (ele.status) {
        this.search();
      }
    });
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/product/customer/get`,
        body,
        {
          headers,
        }
      )
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private Add(id: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(`https://smart-shop-api-eta.vercel.app/product/wishlist`, id, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private Remove(id: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/product/wishlist/remove`,
        id,
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
