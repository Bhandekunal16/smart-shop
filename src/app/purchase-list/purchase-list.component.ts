import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';
import { TablesComponent } from '../tables/tables.component';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [SharedModule, TablesComponent],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss',
})
export class PurchaseListComponent implements OnInit {
  public products: any[] = [];
  public msg: Message[] | any;
  public totalCost: number | undefined;
  public header!: any[];

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit(): void {
    this.messageHandler('info', 'Searching for your purchased products!');
    this.list();
  }

  private list() {
    this.purchasedList({ id: localStorage.getItem('id') }).subscribe((ele) => {
      console.log(this.products);
      this.totalCost = ele.data.reduce(
        (accumulator: any, currentValue: any) =>
          accumulator + currentValue.productCost,
        0
      );
      this.products = ele.data.map((data: any) => {
        return {
          ProductName: data.ProductName,
          brandName: data.brandName,
          productCost: data.productCost,
          productType: data.productType,
          IsPurchased: data.IsPurchased ? 'Sold' : 'Unsold',
          ProductDescription: data.ProductDescription,
        };
      });

      this.header = Object.keys(this.products[0]);
      this.products.length == 0
        ? this.messageHandler('warn', 'you do not purchase anything till now')
        : this.messageHandler(
            'success',
            `purchased product found ${this.products.length}`
          );
      this.clearMessagesAfterDelay();
    });
  }

  public viewRecept(object: any) {
    localStorage.setItem('payment', JSON.stringify(object));
    this.viewProduct();
  }

  public getStatusInfo(isPurchased: boolean): { text: string; class: string } {
    return isPurchased
      ? { text: 'Purchased', class: 'purchased' }
      : { text: 'Process', class: 'Process' };
  }

  private purchasedList(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/payment/purchase/${id.id}`,
        { headers }
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

  private viewProduct(): void {
    this.route.navigate(['customer-dashboard/recept']);
  }
}
