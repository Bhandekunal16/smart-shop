import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MessagesModule,
    HttpClientModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(
    private router: Router,
    private settler: SettlerService,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  submitForm() {
    const email: string = this.myForm.value.email;
    this.settler.emailObj = email;

    this.sendOtp({ email }).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);
      if (!res.status) {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'something went wrong',
          },
        ];
      } else {
        this.verifyOtp();
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'otp send to your email.',
          },
        ];
      }
    });
  }

  verifyOtp(): void {
    this.router.navigate(['/verify-otp']);
  }

  sendOtp(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/otp/send', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
