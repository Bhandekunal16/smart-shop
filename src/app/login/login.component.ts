import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

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

  constructor(
    private router: Router,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
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

        const id = data.data.id;
        localStorage.setItem('id', id);

        if (data.data.userType == 'MERCHANT') {
          this.dashboard();
        } else {
          this.customerDashboard();
        }
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

  customerDashboard(): void {
    this.router.navigate(['customer-dashboard']);
  }

  forgetPassword(): void {
    this.router.navigate(['/forget-password']);
  }

  login(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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
}
