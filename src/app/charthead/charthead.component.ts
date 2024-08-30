import { Component } from '@angular/core';
import { ChartlineComponent } from '../chartline/chartline.component';
import { ChartProductComponent } from '../chart-product/chart-product.component';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-charthead',
  standalone: true,
  imports: [ChartlineComponent, ChartProductComponent, SharedModule],
  templateUrl: './charthead.component.html',
  styleUrl: './charthead.component.scss',
})
export class ChartheadComponent {
  public header: string = 'Sales Distribution Overview';
  public type: any[] = [];
  public sold: any[] = [];
  public loader: boolean = false;
  public msg: Message[] | any;
  public Name: any[] = [];
  public Value: any[] = [];
  public array: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.messageHandler('info', 'searching products for you !');
    this.loader = true;
    this.getShopId({ id: localStorage.getItem('id') }).subscribe((ele) => {
      this.shopDetails({
        id: ele.data,
      }).subscribe((ele) => {
        const data1 = [];
        const data2 = [];
        for (let index = 0; index < ele.data.length; index++) {
          data1.push(ele.data[index].Type);
          data2.push(ele.data[index].sold);
        }

        this.type = data1;
        this.sold = data2;

        this.messageHandler(
          'success',
          `sold products found ${data2.length} for you!`
        );
        this.clearMessagesAfterDelay();

        this.loader = false;
      });
    });

    this.productCount({ id: localStorage.getItem('id') }).subscribe((ele) => {
      this.array = ele.data;

      let value = [];
      let name = [];
      for (let index = 0; index < this.array.length; index++) {
        name.push(this.array[index].name.slice(0, 8));
        value.push(this.array[index].count);
      }

      this.Name = name;
      this.Value = value;

      const total = this.Value.reduce((a, b) => {
        return a + b;
      }, 0);

      this.messageHandler('success', `sold products found ${total} for you!`);
      this.clearMessagesAfterDelay();
    });
  }

  private getShopId(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/shop/id/${id.id}`,

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

  public shopDetails(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/product/get/sell/${id.id}`,
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

  public productCount(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/product/count/${id.id}`,
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 2000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }
}
