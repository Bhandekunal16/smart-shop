import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MessagesModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private router: Router, private http: HttpClient) {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      gmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  async submitForm() {
    const firstName: string = this.myForm.value.firstName;
    const lastName: string = this.myForm.value.lastName;
    const email: string = this.myForm.value.gmail;
    const mobileNo: number = this.myForm.value.mobileNo;
    const password: string = this.myForm.value.Password;

    this.register({
      firstName,
      lastName,
      email,
      mobileNo,
      password,
    }).subscribe((data) => {
      if (data.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'register successfully !',
          },
        ];
        this.dashboard();
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: `${data.msg}`,
          },
        ];
      }
    });
  }

  login(): void {
    this.router.navigate(['']);
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  register(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/register', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
