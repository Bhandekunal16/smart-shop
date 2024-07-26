import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, timeInterval } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SharedModule],
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
    this.msg = [
      {
        severity: 'info',
        summary: `heading to purchasing product`,
      },
    ];
    this.view();
  }

  view() {
    let array = [];
    this.Details().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.myForm.patchValue(data.data);
      array.push(data.data);
      this.msg = [
        {
          severity: 'success',
          summary: `purchasing request for ${data.data.ProductName}`,
        },
      ];
      this.data = array;

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  purchaseProduct(id: any) {
    const userId = localStorage.getItem('id');
    let payload = {
      userId: userId,
      productId: id,
    };

    this.add(payload).subscribe((ele) => {
      let data = this.decrypt.decrypt(ele.response);
      data;

      if (data.status) {
        this.list();
      }
    });
  }

  list() {
    this.router.navigate(['customer-dashboard/purchasedList']);
  }

  now(input: string) {
    return btoa(input);
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

  add(request: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/payment/request`,
        request,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
