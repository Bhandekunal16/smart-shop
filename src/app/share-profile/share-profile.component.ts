import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from 'primeng/api';
import { header } from '../string';

@Component({
  selector: 'app-share-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './share-profile.component.html',
  styleUrl: './share-profile.component.scss',
})
export class ShareProfileComponent {
  public id: string | null | undefined;
  public email: string | undefined;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public mobileNo: string | undefined;
  public userType: string | undefined;
  public profileImage: string | undefined;
  public lastUpdated: string | undefined;
  public userPresent: boolean = false;
  public ID: string | undefined;
  public msg: Message[] | any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.shopDetails(this.id).subscribe((ele) => {
        this.email = ele.data.email;
        this.firstName = ele.data.firstName;
        this.lastName = ele.data.lastName;
        this.mobileNo = ele.data.mobileNo;
        this.userType = ele.data.userType;
        this.profileImage = `data:image/webp;base64,${btoa(
          ele.data.profileImage
        )}`;
        this.lastUpdated = ele.data.createdOn;
        this.ID = ele.data.id;
        this.userPresent =
          localStorage.getItem('id') == undefined ? false : true;
      });
    });
  }

  public register() {
    this.router.navigate(['']);
  }

  public subscribe() {
    this.shopId(this.ID).subscribe((ele) => {
      this.Subscribe(ele.data).subscribe((ele) => {
        ele.status
          ? this.messageHandler('success', `${ele.data}`)
          : this.messageHandler('error', `${ele.data}`);
        this.clearMessagesAfterDelay();
      });
    });
  }

  private shopDetails(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/auth/getUser/email/${id}`,
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

  private shopId(id: any): Observable<any> {
    const headers = header();
    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/shop/id/${id}`,
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

  private Subscribe(id: any): Observable<any> {
    const headers = header();
    return this.http.post<any>(
      'https://smart-shop-api-eta.vercel.app/auth/customer/subscribe',
      { id: id, customerId: localStorage.getItem('id') },
      { headers }
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
