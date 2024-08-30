import { Component } from '@angular/core';
import { ChartlineComponent } from '../chartline/chartline.component';
import { ChartProductComponent } from '../chart-product/chart-product.component';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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

        this.loader = false;
      });
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
}
