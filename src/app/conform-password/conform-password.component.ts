import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-conform-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './conform-password.component.html',
  styleUrl: './conform-password.component.scss',
})
export class ConformPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;
  public flag: any = true;

  constructor(private router: Router, private http: HttpClient) {
    this.myForm = new FormGroup({
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  public submitForm() {
    const password: string = this.myForm.value.Password;
    const email: any = localStorage.getItem('email');

    this.flag = false;
    this.messageHandler('info', 'Conforming the password...');

    this.conformPassword({ password, email }).subscribe((data) => {
      localStorage.setItem('id', data.data.id);
      this.flag = true;

      if (data.status) {
        this.messageHandler('success', 'password changed successfully.');

        data.data.userType == 'MERCHANT'
          ? this.dashboard()
          : this.customerDashboard();
      } else {
        this.messageHandler('warn', 'something went wrong');
        this.clearMessagesAfterDelay();
      }
    });
  }

  private dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private customerDashboard(): void {
    this.router.navigate(['/customer-dashboard']);
  }

  private conformPassword(body: any): Observable<any> {
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }
}
