import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { subscribe } from 'node:diagnostics_channel';

@Component({
  selector: 'app-chartline',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chartline.component.html',
  styleUrl: './chartline.component.scss',
})
export class ChartlineComponent {
  constructor(private http: HttpClient) {}
  public data: any;
  public options: any;
  public msg: Message[] | any;
  public flag: boolean = false;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

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
        this.flag = true;

        this.data = {
          labels: data1,
          datasets: [
            {
              data: data2,
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--green-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--green-400'),
              ],
            },
          ],
        };

        this.options = {
          cutout: '60%',
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
        };
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
