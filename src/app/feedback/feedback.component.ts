import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private http: HttpClient, private decrypt: DecryptService) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
      message: new FormControl(''),
    });
  }

  submitForm() {
    const email = this.myForm.value.email;
    const message = this.myForm.value.message;

    const body = { email, message };
     (email, message);

    this.sendOtp(body).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);

      data.status
        ? (this.msg = [
            {
              severity: 'success',
              summary: 'success',
              detail: `${data.data}`,
            },
          ])
        : (this.msg = [
            {
              severity: 'warn',
              summary: 'warn',
              detail: `${data.data}`,
            },
          ]);

      setInterval(() => {
        window.location.reload();
      }, 3000);
    });
  }

  sendOtp(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/feedback', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
