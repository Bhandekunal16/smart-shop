import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-update-rating',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RatingModule,
    CardModule,
    MessagesModule,
  ],
  templateUrl: './update-rating.component.html',
  styleUrl: './update-rating.component.scss',
})
export class UpdateRatingComponent implements OnInit {
  public data: any[] = [];
  public msg: Message[] | any;
  public myForm: FormGroup | any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private decrypt: DecryptService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      rating: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.Details().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      let array = [];
      array.push(res.data);
      this.data = array;

      console.log(typeof this.myForm.value.rating == 'string');
      console.log(typeof this.myForm.value.rating == 'number');

      let rating;
      if (typeof this.myForm.value.rating == 'string') {
        rating = this.data[0].rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rating = this.data[0].rating;
      } else {
        rating = this.data[0].rating.low;
      }

      console.log(rating);

      // const rating = this.data[0].rating;
      this.myForm.patchValue({ rating: rating });
    });
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  submitForm() {
    this.Details().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      console.log(typeof this.myForm.value.rating == 'string');
      console.log(this.myForm.value.rating, typeof this.myForm.value.rating);

      let rate;
      if (typeof this.myForm.value.rating == 'string') {
        rate = this.myForm.value.rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rate = this.myForm.value.rating;
      } else {
        rate = this.myForm.value.rating.low;
      }

      console.log(rate);

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

        setInterval(() => {
          window.location.reload();
        }, 3000);
      });
      console.log(rate);
    });
  }

  Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    console.log(id, 'i am hitting');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`http://localhost:3003/product/get/${id}`, { headers })
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
      .post<any>('http://localhost:3003/product/rating', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
