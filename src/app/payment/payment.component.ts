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

  onProductCostInput() {
    if (this.myForm.get('productCost')?.value) {
      this.myForm.get('discount')?.disable();
    } else {
      this.myForm.get('discount')?.enable();
    }
  }

  onDiscountInput() {
    if (this.myForm.get('discount')?.value) {
      this.myForm.get('productCost')?.disable();
    } else {
      this.myForm.get('productCost')?.enable();
    }
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

  async adjust(originalPrice: any) {
    console.log(originalPrice);
    const cost = this.myForm.get('productCost')?.value == originalPrice ? 0 : this.myForm.get('productCost')?.value
    const discount = this.myForm.get('discount')?.value;



    console.log(discount)

    if (cost > 0) {
      this.myForm.patchValue({ productCost: cost });
      let payload = {
        id: localStorage.getItem('currentObjectId'),
        productCost: this.myForm.value.productCost,
      };
      this.editShopDetails(payload).subscribe((response) => {
        const data = this.decrypt.decrypt(response.response);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    } else if (discount) {
      const productCost = originalPrice - (originalPrice * discount) / 100;
      await this.myForm.patchValue({ productCost: productCost });
      let payload = {
        id: localStorage.getItem('currentObjectId'),
        productCost: productCost,
      };
       this.editShopDetails(payload).subscribe((response) => {
        const data = this.decrypt.decrypt(response.response);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      });
    }
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
      .post<any>('http://localhost:3003/product/adjust/rate', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
