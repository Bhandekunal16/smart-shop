import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-chart-product',
  standalone: true,
  imports: [ChartModule, CommonModule, HttpClientModule],
  templateUrl: './chart-product.component.html',
  styleUrl: './chart-product.component.scss',
})
export class ChartProductComponent implements OnInit {
  basicData: any;
  basicOptions: any;

  public Name: any[] = [];
  public Value: any[] = [];
  public array: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.shopDetails().subscribe(
      (ele) => {
        this.array = ele.data;
        console.log(this.array);
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
      .get<any>(`http://localhost:3003/product/count/${id}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
