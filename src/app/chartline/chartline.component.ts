import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';

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

    this.shopDetails().subscribe((ele) => {

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
  }

  public shopDetails(): Observable<any> {
    const id = 'b8f993a9-abe9-449e-9662-225d8d6d0259';
    const headers = header();
    return this.http
      .get<any>(`http://localhost:3003/product/get/sell/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
