import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { header } from '../string';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-add-url',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-url.component.html',
  styleUrl: './add-url.component.scss',
})
export class AddUrlComponent {
  public value: string | undefined;
  public msg: Message[] | any;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  get() {
    this.add({ id: localStorage.getItem('id'), url: this.value }).subscribe(
      (ele) => {
        console.log(ele);
      }
    );
    this.value = '';
  }

  public add(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/add/url', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
