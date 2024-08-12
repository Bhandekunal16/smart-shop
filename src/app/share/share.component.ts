import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private http: HttpClient, private decrypt: DecryptService) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  public submitForm() {
    const email = this.myForm.value.email;
    const message = `
    <h3>Hi,</h3>
    <p>I found this interesting website and thought you might like it:</p>
    <p>https://cyborgcart.vercel.app/</p>
     <p>Best regards,</p>
     <p>${email}</p>
   `;
    this.sendOtp({ email, message }).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      data.status
        ? this.messageHandler('success', `${data.data}`)
        : this.messageHandler('warn', `${data.data}`);
      this.clearMessagesAfterDelay();
      this.myForm.reset();
    });
  }

  public shareProfile() {
    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe((res) => {
      const data = this.decrypt.decrypt(res.response);
      const email = this.myForm.value.email;
      const message = `https://cyborgcart.vercel.app/in/${data.data.email}`;
      this.sendOtp({ email, message }).subscribe((ele) => {
        const data = this.decrypt.decrypt(ele.response);
        data.status
          ? this.messageHandler('success', `${data.data}`)
          : this.messageHandler('warn', `${data.data}`);
        this.clearMessagesAfterDelay();
        this.myForm.reset();
      });
    });
  }

  private shopDetails(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/auth/getUser/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private sendOtp(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/email', body, {
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
}
