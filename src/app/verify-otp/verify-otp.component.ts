import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { SettlerService } from '../common/settler.service';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  public msg: Message[] | any;
  public myForm: FormGroup;
  public flag: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private settler: SettlerService,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
    this.myForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  submitForm() {
    const otp: string = this.myForm.value.otp;
    const email: string | any = localStorage.getItem('email');
    this.flag = false;

    this.msg = [
      {
        severity: 'info',
        summary: 'checking otp!',
      },
    ];

    this.verifyOtp({ otp, email }).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);
      this.flag = true;
      if (res.status) {
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
            detail: `${res.msg}`,
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
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/auth/otp/verify',
        body,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
