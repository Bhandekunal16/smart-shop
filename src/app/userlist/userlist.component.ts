import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [HttpClientModule, TableModule, CommonModule, ButtonModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  products!: any[];
  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    this.customerSubscribed().subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.products = data.data;
    });
  }
  customerSubscribed(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const id = localStorage.getItem('id');

    return this.http
      .get<any>(
        `http://localhost:3003/auth/getAll/customers/subscribed/${id}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
