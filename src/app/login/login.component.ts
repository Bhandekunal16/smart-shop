import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;
  public flag: boolean = true;
  public visible: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    this.myForm = new FormGroup({
      Username: new FormControl(''),
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  public submitForm() {
    this.flag = false;

    this.login({
      username: this.myForm.value.Username,
      password: this.myForm.value.Password,
    }).subscribe((data) => {
      if (data.status) {
        this.messageHandler('success', 'login successfully !');
        this.flag = true;

        localStorage.setItem('id', data.data.id);
        localStorage.setItem('status', data.data.status);
        localStorage.setItem(
          'username',
          `${data.data.firstName} ${data.data.lastName}`
        );
        localStorage.setItem('type', data.data.userType);
        localStorage.setItem('lastLogin', `${new Date().getTime()}`);

        data.data.userType == 'MERCHANT'
          ? this.dashboard()
          : this.customerDashboard();
      } else this.messageHandler('warn', 'please check login credential !');
      this.clearMessagesAfterDelay();
    });
  }

  private login(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/login', body, {
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  public showDialog() {
    this.visible = true;
  }

  public register(): void {
    this.router.navigate(['/register']);
  }

  private dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private customerDashboard(): void {
    this.router.navigate(['customer-dashboard']);
  }

  public forgetPassword(): void {
    this.router.navigate(['/forget-password']);
  }
}
