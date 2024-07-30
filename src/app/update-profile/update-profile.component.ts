import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';

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
  public Status: boolean | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private decrypt: DecryptService,
    private statusService: StateService
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
    this.msg = [
      {
        severity: 'info',
        summary: 'searching for your profile information.',
      },
    ];
    this.getDetails();
  }

  getDetails() {
    const id = localStorage.getItem('id');
    console.log(this.obj);

    this.shopDetails(id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.myForm.patchValue(data.data);
      this.obj = data.data;
      this.Status = data.data.status;
      localStorage.setItem('status', data.data.status);
      this.setStatus(data.data.status);
      this.msg = [
        {
          severity: data.status ? 'success' : 'warn',
          summary: data.status
            ? `welcome ${data.data.email}`
            : 'profile not found',
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  setStatus(status: boolean) {
    this.statusService.setStatus(status);
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

  delete() {
    try {
      const id = localStorage.getItem('id');
      this.status(id).subscribe((ele) => {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Profile status changed',
          },
        ];

        this.getDetails();
      });
    } catch (error) {
      console.log(' this is not an error ');
    }
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    try {
      this.selectedImage = await this.convertToWebPAndBinaryString(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  convertToWebPAndBinaryString(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const arrayReader = new FileReader();
                  arrayReader.readAsBinaryString(blob);
                  arrayReader.onload = () => {
                    const binaryString = arrayReader.result as string;
                    resolve(binaryString);
                  };
                  arrayReader.onerror = (error) => reject(error);
                } else {
                  reject(new Error('Conversion to WebP failed'));
                }
              },
              'image/webp',
              0.8 // Quality factor for WebP format
            );
          } else {
            reject(new Error('Canvas context is not supported'));
          }
        };

        img.onerror = (error) => reject(error);
      };

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

  status(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/auth/status/${id}`, {
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
      .post<any>('https://smart-shop-api-eta.vercel.app/auth/update', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
