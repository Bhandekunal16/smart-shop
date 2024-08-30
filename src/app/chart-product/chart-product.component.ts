import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input, OnInit } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { header } from '../string';

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
  public array: any[] = [];
  public msg: Message[] | any;

  @Input() data1: any[] | undefined;
  @Input() data2: any[] | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: this.data1,
      datasets: [
        {
          label: 'Products',
          data: this.data2,
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
  }

  public shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = header();
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
}
