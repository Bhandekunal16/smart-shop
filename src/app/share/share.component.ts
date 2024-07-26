import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

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

  submitForm() {
    const email = this.myForm.value.email;
    const message = `
    <h3>Hi,</h3>
    <p>I found this interesting website and thought you might like it:</p>
     
    <p>https://cyborgcart.vercel.app/</p>
    

     <p>Best regards,</p>
     <p>${email}</p>
   `;

    const body = { email, message };

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

      this.myForm.reset();
    });
  }

  sendOtp(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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
}
