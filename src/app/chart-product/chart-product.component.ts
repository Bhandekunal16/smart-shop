import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-chart-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chart-product.component.html',
  styleUrl: './chart-product.component.scss',
})
export class ChartProductComponent implements OnInit {
  public basicData: any;
  public basicOptions: any;
  public Name: any[] = [];
  public Value: any[] = [];
  public array: any[] = [];
  public flag: boolean = false;
  public msg: Message[] | any;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.flag = false;

    this.messageHandler('info', 'searching products for you !');

    this.shopDetails().subscribe(
      (ele) => {
        const res = this.decrypt.decrypt(ele.response);
        this.array = res.data;

        let value = [];
        let name = [];
        for (let index = 0; index < this.array.length; index++) {
          name.push(this.array[index].name.slice(0, 8));
          value.push(this.array[index].count);
        }

        this.Name = name;
        this.Value = value;
        this.flag = true;

        res.response == null && res.data == undefined
          ? this.messageHandler(
              'warn',
              'you currently not have any product, create shop & add some product',
              'No Data'
            )
          : this.messageHandler('success', 'product found at your shop');

        this.clearMessagesAfterDelay();

        this.basicData = {
          labels: this.Name,
          datasets: [
            {
              label: 'Sales',
              data: this.Value,
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 1,
            },
          ],
        };

        this.basicOptions = {
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            x: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      },
      (error) => {
        console.error('Error fetching shop details:', error);
        window.location.reload();
      }
    );
  }

  public shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = this.header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/count/${id}`, {
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

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
