import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public myForm: FormGroup | any;
  public flag: boolean = true;
  public msg: Message[] | any;
  public selectedImage: File | any = null;
  public options: string[] | any = ['CUSTOMER', 'MERCHANT'];

  constructor(private router: Router, private http: HttpClient) {
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

  public async submitForm(): Promise<void> {
    this.flag = false;
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
      if (data.status) {
        this.messageHandler('success', 'register successfully !');

        localStorage.setItem('id', data.data.id);
        localStorage.setItem('type', data.data.userType);
        localStorage.setItem('status', data.data.status);
        localStorage.setItem(
          'username',
          `${data.data.firstName} ${data.data.lastName}`
        );
        localStorage.setItem('lastLogin', `${new Date().getTime()}`);
        this.flag = data.status;

        data.data.userType == 'MERCHANT'
          ? this.dashboard()
          : this.customerDashboard();
      } else this.messageHandler('warn', `${data.response}`);
    });
  }

  public async onImageSelected(event: any) {
    try {
      const [file, maxSize] = [event.target.files[0], 2 * 1024 * 1024];
      if (file.size > maxSize) {
        this.messageHandler('warn', 'File size exceeds 2MB limit.');
        event.target.value = '';
        return;
      }
      this.selectedImage = await this.convertToWebPAndBinaryString(file);
      this.clearMessagesAfterDelay();
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

  private register(body: any): Observable<any> {
    const headers = this.header();
    return this.http
      .post<any>(' https://smart-shop-api-eta.vercel.app/auth/register', body, {
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

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  public login(): void {
    this.router.navigate(['']);
  }

  private dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private customerDashboard(): void {
    this.router.navigate(['/customer-dashboard']);
  }
}
