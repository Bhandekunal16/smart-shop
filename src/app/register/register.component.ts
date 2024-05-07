import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MessagesModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public myForm: FormGroup | any;
  public msg: Message[] | any;
  private selectedOption: any;
  public selectedImage: File | any = null;
  public options: string[] | any = ['CUSTOMER', 'MERCHANT'];

  constructor(
    private router: Router,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      gmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
      userType: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {}

  async submitForm(): Promise<void> {
    const firstName: string = this.myForm.value.firstName;
    const lastName: string = this.myForm.value.lastName;
    const email: string = this.myForm.value.gmail;
    const mobileNo: number = this.myForm.value.mobileNo;
    const password: string = this.myForm.value.Password;
    const userType: string = this.myForm.value.userType;
    const profileImage = this.selectedImage;

    this.register({
      firstName,
      lastName,
      email,
      mobileNo,
      password,
      userType,
      profileImage,
    }).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);
      const id = localStorage.setItem('id', res.data.id);
      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'register successfully !',
          },
        ];

        res.data.userType == 'MERCHANT'
          ? this.dashboard()
          : this.customerDashboard();
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: `${res.response}`,
          },
        ];
      }
    });
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    try {
      this.selectedImage = await this.uploadFile(file);
      console.log('Image uploaded successfully:', this.selectedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  uploadFile(event: any): Promise<string | null> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      let file = event;
      if (event) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.getBase64(file)
            .then((res: any) => resolve(res))
            .catch((err) => reject(err));
        };
        reader.onerror = (error) => reject(error);
      } else {
        resolve(null);
      }
    });
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  login(): void {
    this.router.navigate(['']);
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  customerDashboard(): void {
    this.router.navigate(['/customer-dashboard']);
  }

  register(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/register', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
