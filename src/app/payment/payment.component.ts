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
    this.messageHandler('info', `heading to purchasing product`);
    this.view();
  }

  public view() {
    let array = [];
    this.Details().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.myForm.patchValue(data.data);
      array.push(data.data);
      this.data = array;
      this.messageHandler(
        'success',
        `purchasing request for ${data.data.ProductName}`
      );
      this.clearMessagesAfterDelay();
    });
  }

  public getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  public purchaseProduct(id: any) {
    this.add({
      userId: localStorage.getItem('id'),
      productId: id,
    }).subscribe((ele) => {
      let data = this.decrypt.decrypt(ele.response);
      if (data.status) {
        this.list();
      }
    });
  }

  private list() {
    const userType = localStorage.getItem('type');
    userType == 'MERCHANT'
      ? this.router.navigate(['dashboard/purchasedList'])
      : this.router.navigate(['customer-dashboard/purchasedList']);
  }

  public now(input: string) {
    return btoa(input);
  }

  private Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = this.header();
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

  private add(request: any): Observable<any> {
    const headers = this.header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
