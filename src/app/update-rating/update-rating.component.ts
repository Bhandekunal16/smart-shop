import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

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

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      rating: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.messageHandler('info', 'getting product information.');
    this.search();
  }

  private search() {
    this.Details().subscribe((ele) => {
      let array = [];
      array.push(ele.data);
      this.data = array;
      let rating;
      if (typeof this.myForm.value.rating == 'string') {
        rating = this.data[0].rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rating = this.data[0].rating;
      } else {
        rating = this.data[0].rating.low;
      }
      this.messageHandler('success', 'your product ready to rate');
      this.myForm.patchValue({ rating: rating });
      this.clearMessagesAfterDelay();
    });
  }

  public now(input: string) {
    return `data:image/webp;base64,${btoa(input)}`;
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public submitForm() {
    this.Details().subscribe((ele) => {
      // const res = this.decrypt.decrypt(ele.response);
      let rate;
      if (typeof this.myForm.value.rating == 'string') {
        rate = this.myForm.value.rating;
      } else if (typeof this.myForm.value.rating == 'number') {
        rate = this.myForm.value.rating;
      } else {
        rate = this.myForm.value.rating.low;
      }

      this.editShopDetails({
        userId: localStorage.getItem('id'),
        productId: ele.data.id,
        rating: rate,
      }).subscribe((ele) => {
        this.messageHandler('success', ele.data);
        this.clearMessagesAfterDelay();
      });
    });
  }

  private Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = header();
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

  private editShopDetails(body: any): Observable<any> {
    const headers = header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
