import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MessagesModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

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

  submitForm() {
    const username: string = this.myForm.value.Username;
    const password: string = this.myForm.value.Password;

    this.login({ username, password }).subscribe((data) => {
      if (data.status) {
        console.log(`login true`);
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'login successfully !',
          },
        ];
        this.dashboard();
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'please check login credential !',
          },
        ];
        console.log(`login false`);
      }
    });
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  forgetPassword(): void {
    this.router.navigate(['/forget-password']);
  }

  login(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/login', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
