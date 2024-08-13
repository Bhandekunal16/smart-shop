import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { header } from '../string';

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
  public selectedImage: File | any = null;
  public options: string[] | any = ['CUSTOMER', 'MERCHANT'];
  public Status: boolean | undefined;

  constructor(
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
    this.messageHandler('info', 'searching for your profile information.');
    this.getDetails();
  }

  private getDetails() {
    const id = localStorage.getItem('id');
    this.shopDetails(id).subscribe((ele) => {
      // const data = this.decrypt.decrypt(ele.response);
      this.myForm.patchValue(ele.data);
      this.obj = ele.data;
      this.Status = ele.data.status;
      localStorage.setItem('status', ele.data.status);
      this.setStatus(ele.data.status);
      this.messageHandler(
        ele.status ? 'success' : 'warn',
        ele.status ? `welcome ${ele.data.email}` : 'profile not found'
      );
      this.clearMessagesAfterDelay();
    });
  }

  private setStatus(status: boolean) {
    this.statusService.setStatus(status);
  }

  public submitForm() {
    this.editUserDetails({
      ...this.obj,
      firstName: this.myForm.value.firstName,
      lastName: this.myForm.value.lastName,
      email: this.myForm.value.email,
      mobileNo: this.myForm.value.mobileNo,
      profileImage: this.selectedImage,
    }).subscribe(() => {
      this.messageHandler('success', 'Profile edited successfully!');
    });
  }

  public delete() {
    try {
      const id = localStorage.getItem('id');
      this.status(id).subscribe(() => {
        this.messageHandler('success', 'Profile status changed');
        this.getDetails();
      });
    } catch (error) {
      console.log(' this is not an error ');
    }
  }

  public async onImageSelected(event: any) {
    try {
      const [file, maxSize] = [event.target.files[0], 2 * 1024 * 1024];
      if (file.size > maxSize) {
        this.messageHandler('warn', 'File size exceeds 2MB limit.');
        event.target.value = '';
        this.clearMessagesAfterDelay();
        return;
      }
      this.selectedImage = await this.convertToWebPAndBinaryString(file);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  private convertToWebPAndBinaryString(file: File): Promise<string | null> {
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
              0.8
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

  private shopDetails(id: any): Observable<any> {
    const headers = header();
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

  private status(id: any): Observable<any> {
    const headers = header();
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

  private editUserDetails(body: any): Observable<any> {
    const headers = header();
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

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }
}
