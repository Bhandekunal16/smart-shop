import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-edit-shop',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MessagesModule,
  ],
  templateUrl: './edit-shop.component.html',
  styleUrl: './edit-shop.component.scss',
})
export class EditShopComponent {
  public myForm: FormGroup | any;
  public obj: any;
  public msg: Message[] | any;

  constructor(private http: HttpClient, private router: Router) {
    this.myForm = new FormGroup({
      shopName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      officialEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      officialContactNo: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}'),
      ]),
      shopGst: new FormControl('', Validators.required),
      panNo: new FormControl(
        '',
        Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')
      ),
      pinCode: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{6}'),
      ]),
    });
  }

  submitForm() {
    console.log(this.myForm.value.shopName);
    let payload = {
      ...this.obj,
      address: this.myForm.value.address,
      shopName: this.myForm.value.shopName,
      officialEmail: this.myForm.value.officialEmail,
      officialContactNo: this.myForm.value.officialContactNo,
    };

    this.editShopDetails(payload).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop edited successfully!',
        },
      ];

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  ngOnInit(): void {
    this.details();
  }

  details() {
    const id = localStorage.getItem('id');

    this.shopDetails({ id }).subscribe((ele) => {
      this.myForm.patchValue(ele.data);
      this.obj = ele.data;
    });
  }

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/shop/search', body, { headers })
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
      .post<any>('http://localhost:3003/shop/edit', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
