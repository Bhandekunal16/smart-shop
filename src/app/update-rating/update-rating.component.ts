import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-update-rating',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-rating.component.html',
  styleUrl: './update-rating.component.scss',
})
export class UpdateRatingComponent implements OnInit {
  public data: any[] = [];
  public msg: Message[] | any;
  public myForm: FormGroup | any;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      rating: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        summary: 'getting product information.',
      },
    ];
    this.search();
  }

  search() {
    this.Details().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      let array = [];
      array.push(res.data);
      this.data = array;
      let rating;
      if (typeof this.myForm.value.rating == 'string') {
        rating = this.data[0].rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rating = this.data[0].rating;
      } else {
        rating = this.data[0].rating.low;
      }

      this.msg = [
        {
          severity: 'success',
          summary: 'your product ready to rate',
        },
      ];

      this.myForm.patchValue({ rating: rating });

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  now(input: string) {
    return `data:image/webp;base64,${btoa(input)}`;
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  submitForm() {
    this.Details().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      typeof this.myForm.value.rating == 'string';
      this.myForm.value.rating, typeof this.myForm.value.rating;

      let rate;
      if (typeof this.myForm.value.rating == 'string') {
        rate = this.myForm.value.rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rate = this.myForm.value.rating;
      } else {
        rate = this.myForm.value.rating.low;
      }

      rate;

      const userId = localStorage.getItem('id');

      const id = res.data.id;
      const body = {
        userId: userId,
        productId: id,
        rating: rate,
      };

      this.editShopDetails(body).subscribe((ele) => {
        const res = this.decrypt.decrypt(ele.response);

        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: res.data,
          },
        ];
      });
      rate;
    });
  }

  Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/get/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  editShopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/product/rating', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
