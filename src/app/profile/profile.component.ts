import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public msg: Message[] | any;
  public email: string | undefined;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public mobileNo: string | undefined;
  public userType: string | undefined;
  public profileImage: string | undefined;

  constructor(
    private http: HttpClient,
    private decrypt: DecryptService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        summary: 'Searching your profile data !',
      },
    ];
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
      this.profileImage = `data:image/jpeg;base64,${btoa(
        data.data.profileImage
      )}`;
      this.msg = [
        {
          severity: data.status == true ? 'success' : 'warn',
          summary: `Welcome ${data.data.firstName} ${data.data.lastName}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  edit() {
    this.update();
  }

  update(): void {
    this.router.navigate(['/customer-dashboard/updateProfile']);
  }

  shopDetails(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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
}
