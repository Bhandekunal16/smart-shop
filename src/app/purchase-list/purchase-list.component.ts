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
  products!: any[];
  public msg: Message[] | any;
  public totalCost: number | undefined;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        summary: 'Searching for your purchased products!',
      },
    ];
    this.list();
  }

  list() {
    let id = localStorage.getItem('id');

    this.purchasedList(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
      this.totalCost = data.data.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      );

      this.products.length == 0
        ? (this.msg = [
            {
              severity: 'warn',
              summary: 'you do not purchase anything till now',
            },
          ])
        : (this.msg = [
            {
              severity: 'success',
              summary: `purchased product found ${this.products.length}`,
            },
          ]);
    });
  }

  viewProduct(): void {
    this.route.navigate(['customer-dashboard/recept']);
  }

  viewRecept(object: any) {
    object;
    const recept = localStorage.setItem('payment', JSON.stringify(object));
    this.viewProduct();
  }

  getStatusInfo(isPurchased: boolean): { text: string; class: string } {
    if (isPurchased) {
      return { text: 'Purchased', class: 'purchased' };
    } else {
      return { text: 'Process', class: 'Process' };
    }
  }

  purchasedList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/payment/purchase/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
