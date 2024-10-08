import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

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

  constructor(private http: HttpClient) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
      message: new FormControl(''),
    });
  }

  public submitForm() {
    const email = this.myForm.value.email;
    const message = this.myForm.value.message;
    this.sendOtp({ email, message }).subscribe((ele) => {
      this.myForm.reset();
      ele.status
        ? this.messageHandler('success', `${ele.data}`)
        : this.messageHandler('warn', `${ele.data}`);
      this.clearMessagesAfterDelay();
    });
  }

  private sendOtp(body: any): Observable<any> {
    const headers = header();
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

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }
}
