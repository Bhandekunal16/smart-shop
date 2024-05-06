import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { SettlerService } from '../common/settler.service';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-conform-password',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MessagesModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './conform-password.component.html',
  styleUrl: './conform-password.component.scss',
})
export class ConformPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(
    private router: Router,
    private settler: SettlerService,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  submitForm() {
    const password: string = this.myForm.value.Password;
    const email: string = this.settler.emailObj;

    this.conformPassword({ password, email }).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);

      const id = localStorage.setItem('id', res.data.id);
      
      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: 'password changed successfully.',
          },
        ];

        res.data.userType == 'MERCHANT'
          ? this.dashboard()
          : this.customerDashboard();
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'something went wrong',
          },
        ];
      }
    });
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  customerDashboard(): void {
    this.router.navigate(['/customer-dashboard']);
  }

  conformPassword(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/reset/password', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
