import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { options, header } from '../string';

@Component({
  selector: 'app-customer-view-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-product.component.html',
  styleUrl: './customer-view-product.component.scss',
})
export class CustomerViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public showButton: boolean = false;
  public screen: boolean | undefined;
  public flag: boolean | any;
  public myForm: FormGroup | any;
  public loader: boolean = true;
  public skip: number = 0;
  public limit: number = 10;
  public selectedValue: string | undefined;
  public options: string[] | any = options;
  public Filter: string | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private statusService: StateService
  ) {
    this.myForm = new FormGroup({
      productType: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.statusService.status$.subscribe((status) => {
      this.flag = status;
    });
    this.messageHandler('info', 'Searching product for you!');
    this.changer();
    this.search();
  }

  search() {
    this.loader = false;
    this.shopDetails({ skip: this.skip, limit: this.limit }).subscribe(
      (ele) => {
        this.loader = true;
        this.data = ele.data;
        this.messageHandler('success', `products found ${this.data.length}`);
        this.clearMessagesAfterDelay();
      }
    );
  }

  filter() {
    this.loader = false;
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

  public add() {
    this.skip += 10;
    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      productType: this.selectedValue,
      filter : this.Filter
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
      productType: this.selectedValue,
      filter : this.Filter
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
    this.selectedValue = selectedValue;

    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      productType: selectedValue,
    }).subscribe((ele) => {
      this.loader = true;
      this.data = ele.data;
      this.messageHandler('success', `products found ${this.data.length}`);
      this.clearMessagesAfterDelay();
    });
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

  public WishList(id: string) {
    this.Add({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      if (ele.status) {
        this.messageHandler('success', 'add to wish list');
        this.view();
        this.showButton = false;
        this.clearMessagesAfterDelay();
      } else {
        this.messageHandler('warn', ele.response);
        this.showButton = true;
        this.clearMessagesAfterDelay();
      }
    });
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public paymentRoute(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.router.navigate(['customer-dashboard/payment']);
  }

  public setCurrentObjectId(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  public now(input: string) {
    return btoa(input);
  }

  public onViewShop(id: any) {
    localStorage.setItem('viewShopId', id);
    this.viewShop();
  }

  public clearSelection() {
    this.myForm.get('productType')?.setValue('');
    this.selectedValue = '';
    this.Filter = '';
    this.skip = 0;
    this.search();
  }

  private changer() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
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

  private shopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(`https://smart-shop-api-eta.vercel.app/product/customer/get`, body, {
        headers,
      })
      .pipe(
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private edit(): void {
    this.router.navigate(['customer-dashboard/updateRating']);
  }

  private view(): void {
    this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  private viewShop(): void {
    this.router.navigate(['customer-dashboard/viewShop']);
  }
}
