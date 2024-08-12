import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss',
})
export class PurchaseListComponent implements OnInit {
  public products!: any[];
  public msg: Message[] | any;
  public totalCost: number | undefined;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.messageHandler('info', 'Searching for your purchased products!');
    this.list();
  }

  private list() {
    this.purchasedList({ id: localStorage.getItem('id') }).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      this.totalCost = data.data.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      );
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
    const headers = this.header();
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

  private viewProduct(): void {
    this.route.navigate(['customer-dashboard/recept']);
  }
}
