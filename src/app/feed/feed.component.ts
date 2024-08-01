import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  public product: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public showButton: boolean = false;
  public screen: boolean | undefined;
  public flag: boolean | any = true;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    this.flag = false;
    this.msg = [
      {
        severity: 'info',
        detail: 'searching products for you !',
      },
    ];
    const id: string | null = localStorage.getItem('id');
    this.shopDetails(id).subscribe((res) => {
      const data: any = this.decrypt.decrypt(res.response);

      if (data.status) {
        this.product = data.data;
        this.flag = true;
        this.msg = [
          {
            severity: 'success',
            detail: `product found ${data.data.length}`,
          },
        ];

        setTimeout(() => {
          this.msg = [];
        }, 1000);
      }
    });
  }

  now(input: string) {
    return btoa(input);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  private shopDetails(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/products/${id}`,
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
