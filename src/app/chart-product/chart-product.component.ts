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
  basicData: any;
  basicOptions: any;

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

    this.shopDetails().subscribe(
      (ele) => {
        const res = this.decrypt.decrypt(ele.response);
        this.array = res.data;

        this.flag = true;

        this.msg = [
          {
            severity: 'info',
            summary: 'searching products for you !',
          },
        ];

        res.response == null && res.data == undefined
          ? (this.msg = [
              {
                severity: 'warn',
                summary: 'No Data',
                detail:
                  'you currently not have any product, create shop & add some product',
              },
            ])
          : (this.msg = [
              {
                severity: 'success',
                summary: 'product found at your shop',
              },
            ]);

        setTimeout(() => {
          this.msg = [];
        }, 1000);

        let value = [];
        let name = [];
        for (let index = 0; index < this.array.length; index++) {
          name.push(this.array[index].name.slice(0, 8));
          value.push(this.array[index].count);
        }

        this.Name = name;
        this.Value = value;

        // Set chart data here
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
      }
    );
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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
}
