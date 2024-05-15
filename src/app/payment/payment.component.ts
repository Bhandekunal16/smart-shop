import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonModule,
    MessagesModule,
    CardModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
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
      productCost: [{ value: '', disabled: false }, Validators.required],
      discount: [{ value: '', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.view();
  }

  view() {
    let array = [];
    this.Details().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      console.log(data);
      this.myForm.patchValue(data.data);
      array.push(data.data);
      this.data = array;
    });
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  purchaseProduct(id: any) {
    console.log(id);
    const userId = localStorage.getItem('id');
    let payload = {
      userId: userId,
      productId: id,
    };

    this.add(payload).subscribe((ele) => {
      let data = this.decrypt.decrypt(ele.response);
      console.log(data);

      if (data.status) {
        this.list();
      }
    });
  }

  list() {
    this.router.navigate(['customer-dashboard/purchasedList']);
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

  add(request: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(`http://localhost:3003/payment/request`, request, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
