import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { SettlerService } from '../common/settler.service';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    MessagesModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  public msg: Message[] | any;
  public myForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private settler: SettlerService,
    private http: HttpClient
  ) {
    this.myForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  submitForm() {
    const otp: string = this.myForm.value.otp;
    const email: string = this.settler.emailObj;

    this.verifyOtp({ otp, email }).subscribe((data) => {
      if (data.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: 'otp-verified',
          },
        ];
        this.conformPassword();
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'check again',
          },
        ];
      }
    });
  }

  conformPassword(): void {
    this.router.navigate(['/conform-password']);
  }

  verifyOtp(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/otp/verify', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
