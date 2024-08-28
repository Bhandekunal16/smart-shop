import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'primeng/api';
import { header } from '../string';

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

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.messageHandler('info', 'Searching your profile data !');
    this.getDetails();
  }

  private getDetails() {
    this.shopDetails({ id: localStorage.getItem('id') }).subscribe((ele) => {
      // const data = this.decrypt.decrypt(ele.response);
      this.email = ele.data.email;
      this.firstName = ele.data.firstName;
      this.lastName = ele.data.lastName;
      this.mobileNo = ele.data.mobileNo;
      this.userType = ele.data.userType;
      this.profileImage = `data:image/webp;base64,${btoa(
        ele.data.profileImage
      )}`;
      this.messageHandler(
        ele.status == true ? 'success' : 'warn',
        `Welcome ${ele.data.firstName} ${ele.data.lastName}`
      );
      this.clearMessagesAfterDelay();
    });
  }

  public edit() {
    this.update();
  }

  public LogoutSupport() {
    localStorage.clear();
    this.logout();
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/getUser/${body.id}`,
        {
          headers,
        }
      )
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

  private update(): void {
    localStorage.getItem('type') == 'MERCHANT'
      ? this.router.navigate(['/dashboard/profile/update'])
      : this.router.navigate(['/customer-dashboard/profile/update']);
  }

  public info(): void {
    localStorage.getItem('type') == 'MERCHANT'
      ? this.router.navigate(['/dashboard/profile/'])
      : this.router.navigate(['/customer-dashboard/profile/']);
  }

  public order(): void {
    localStorage.getItem('type') == 'MERCHANT'
      ? this.router.navigate(['/dashboard/purchasedList/'])
      : this.router.navigate(['/customer-dashboard/purchasedList/']);
  }

  private logout(): void {
    this.router.navigate(['']);
  }
}
