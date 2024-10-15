import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { header } from '../string';
import { FormGroup, FormControl } from '@angular/forms';
import { Logger } from '../custom.logs';
import { EditShopComponent } from '../edit-shop/edit-shop.component';

@Component({
  selector: 'app-view-shop',
  standalone: true,
  imports: [SharedModule, EditShopComponent],
  templateUrl: './view-shop.component.html',
  styleUrl: './view-shop.component.scss',
})
export class ViewShopComponent implements OnInit {
  public margin: any;
  public value: string | undefined;
  public shopName: string | undefined;
  public shopAddress: string | undefined;
  public mobileNumber: string | undefined;
  public email: string | undefined;
  public status: string | undefined;
  public logo: string | undefined;
  public msg: Message[] | any;
  public flag: boolean = true;
  public urls: any[] = [];
  public screen: string = '250px';
  public typeFlag: boolean = false;
  public visible: boolean = false;
  public visible2: boolean = false;
  public visible3: boolean = false;
  public myForm: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.flag = false;
    this.details();
    this.changer();
    this.typeRender();
  }

  public typeRender() {
    if (localStorage.getItem('type') == 'CUSTOMER') {
      this.typeFlag = true;
    }
  }

  private details() {
    try {
      if (localStorage.getItem('type') == 'MERCHANT') {
        const id = localStorage.getItem('id');
        this.messageHandler(
          'success',
          'Gathering shop information, please wait...'
        );
        this.shopDetails({ id }).subscribe((ele) => {
          this.messageHandler(
            ele.status ? 'success' : 'warn',
            ele.status
              ? `Great news! We found the data for ${ele.data.shopName}`
              : `Oops! Something went wrong with the data fetch`
          );
          this.flag = true;
          this.shopName = ele.data.shopName;
          this.shopAddress = ele.data.address;
          this.mobileNumber = ele.data.officialContactNo;
          this.email = ele.data.officialEmail;
          this.logo = `data:image/webp;base64,${btoa(ele.data.logo)}`;

          ele.data.disable == false || ele.data.disable == null
            ? (this.status = 'Active')
            : (this.status = 'Deactivated');

          setTimeout(() => {
            this.msg = [];
          }, 1000);
        });
        this.shopUrl({ id }).subscribe((ele) => {
          const newArray = ele.data.split('|');
          this.urls = newArray.filter((char: string) => char !== '');
        });
      } else {
        const id = localStorage.getItem('viewShopId');
        this.messageHandler(
          'success',
          'Gathering shop information, please wait...'
        );
        this.shopDetailsNext(id).subscribe((ele) => {
          this.messageHandler(
            ele.status ? 'success' : 'warn',
            ele.status
              ? `Great news! We found the data for ${ele.data.shopName}`
              : `Oops! Something went wrong with the data fetch`
          );
          this.flag = true;
          this.shopName = ele.data.shopName;
          this.shopAddress = ele.data.shopAddress;
          this.mobileNumber = ele.data.officialContactNo;
          this.email = ele.data.officialEmail;
          this.logo = `data:image/webp;base64,${btoa(ele.data.logo)}`;
          ele.data.disable == false || ele.data.disable == null
            ? (this.status = 'Active')
            : (this.status = 'Deactivated');
          this.clearMessagesAfterDelay();
        });
      }
    } catch (error) {
      console.error(`localhost error please ignore`);
    }
  }

  public onFlagChanged(flag: boolean) {
    if (flag) {
      this.messageHandler('info', 'searching product for you!');
      this.flag = false;
      this.details();
      this.changer();
      this.typeRender();
    }
  }

  public now(input: string) {
    return btoa(input);
  }

  public route_to_link(input: string) {
    const url = new URL(input);
    window.open(url.toString(), '_blank');
  }

  public show_url_help() {
    this.visible3 = true;
  }

  public removeUrl(url: any) {
    this.removeUrls({ id: localStorage.getItem('id'), url: url }).subscribe(
      (ele) => {
        this.details();
      }
    );
  }

  public changer() {
    const Screen = window.innerWidth;
    if (Screen < 600) {
      this.screen = '340px';
    }
  }

  public get() {
    this.add({ id: localStorage.getItem('id'), url: this.value }).subscribe(
      (ele) => {
        this.details();
        new Logger().log(ele);
      }
    );
    this.value = '';
  }

  public edit() {
    this.visible2 = true;
  }

  public add(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/add/url', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/search', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopDetailsNext(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/shopDetails/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopUrl(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/shop/get/url/${id.id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private removeUrls(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/shop/remove/url',
        body,
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

  public addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }

  public manageUrls(): void {
    this.visible = true;
  }

  public handleChipClick(id: string) {
    window.open(id, '_blank');
  }
}
