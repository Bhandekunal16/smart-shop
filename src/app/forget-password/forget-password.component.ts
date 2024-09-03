import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  public visible: boolean = false;
  public visibleAgain: boolean = false;
  public myForm2: FormGroup;
  public myForm3: FormGroup;

  constructor(private router: Router, private http: HttpClient) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });

    this.myForm2 = new FormGroup({
      otp: new FormControl(''),
    });

    this.myForm3 = new FormGroup({
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
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
        // this.verifyOtp();
        this.showDialog();
      }
    });
  }

  public submitForm2() {
    const otp: string = this.myForm2.value.otp;
    const email: string | any = localStorage.getItem('email');
    this.flag = false;
    this.messageHandler('info', 'checking otp!');
    this.verifyOtp({ otp, email }).subscribe((data) => {
      this.flag = true;
      if (data.status) {
        this.messageHandler('success', 'otp-verified');
        // this.conformPassword();
        this.visibleAgain = true;
      } else this.messageHandler('warn', `${data.msg}`);
      this.clearMessagesAfterDelay();
    });
  }

  public submitForm3() {
    const password: string = this.myForm3.value.Password;
    const email: any = localStorage.getItem('email');

    this.flag = false;
    this.messageHandler('info', 'Conforming the password...');

    this.conformPassword2({ password, email }).subscribe((data) => {
      localStorage.setItem('id', data.data.id);
      this.flag = true;

      if (data.status) {
        this.messageHandler('success', 'password changed successfully.');
        this.dashboard();
      } else {
        this.messageHandler('warn', 'something went wrong');
        this.clearMessagesAfterDelay();
      }
    });
  }

  private conformPassword2(body: any): Observable<any> {
    const headers = header();

    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/auth/reset/password',
        body,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
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

  public showDialog() {
    this.visible = true;
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  public conformPassword(): void {
    this.router.navigate(['/conform-password']);
  }

  private dashboard(): void {
    this.router.navigate(['']);
  }
}
