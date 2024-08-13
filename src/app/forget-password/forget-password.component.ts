import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;
  public flag: boolean = true;

  constructor(private router: Router, private http: HttpClient) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  public submitForm() {
    this.messageHandler('info', 'sending email to your official email address');
    this.flag = false;
    const email: string = this.myForm.value.email;
    localStorage.setItem('email', email);
    this.sendOtp({ email }).subscribe((data) => {
      this.flag = true;
      if (!data.status) {
        this.messageHandler('warn', 'something went wrong');
      } else {
        this.messageHandler('success', 'otp send to your email.');
        this.verifyOtp();
      }
    });
  }

  private sendOtp(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/otp/send', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private verifyOtp(): void {
    this.router.navigate(['/verify-otp']);
  }
}
