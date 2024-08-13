import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

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
    private http: HttpClient
  ) {
    this.myForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  public submitForm() {
    const otp: string = this.myForm.value.otp;
    const email: string | any = localStorage.getItem('email');
    this.flag = false;
    this.messageHandler('info', 'checking otp!');
    this.verifyOtp({ otp, email }).subscribe((data) => {
      this.flag = true;
      if (data.status) {
        this.messageHandler('success', 'otp-verified');
        this.conformPassword();
      } else this.messageHandler('warn', `${data.msg}`);
      this.clearMessagesAfterDelay();
    });
  }

  private verifyOtp(body: any): Observable<any> {
    const headers = header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  public conformPassword(): void {
    this.router.navigate(['/conform-password']);
  }
}
