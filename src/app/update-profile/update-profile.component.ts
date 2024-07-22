import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent implements OnInit {
  public myForm: FormGroup | any;
  public obj: any;
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
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      userType: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    const id = localStorage.getItem('id');

    this.shopDetails(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.myForm.patchValue(data.data);
      this.obj = data.data;
      data;
    });
  }

  submitForm() {
    let payload = {
      ...this.obj,
      firstName: this.myForm.value.firstName,
      lastName: this.myForm.value.lastName,
      email: this.myForm.value.email,
      mobileNo: this.myForm.value.mobileNo,
      profileImage: this.selectedImage,
    };

    this.editUserDetails(payload).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'Profile edited successfully!',
        },
      ];
    });
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    try {
      this.selectedImage = await this.uploadFile(file);
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

  editUserDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/auth/update', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
