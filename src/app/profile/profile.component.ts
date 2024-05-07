import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardModule, CommonModule, ImageModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public email: string | undefined;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public mobileNo: string | undefined;
  public userType: string | undefined;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}
  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    const id = localStorage.getItem('id');

    this.shopDetails(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
  
      this.email = data.data.email;
      this.firstName = data.data.firstName;
      this.lastName = data.data.lastName;
      this.mobileNo = data.data.mobileNo;
      this.userType = data.data.userType;
    });
  }

  shopDetails(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`http://localhost:3003/auth/getUser/${id}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
