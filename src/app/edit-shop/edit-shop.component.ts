import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-edit-shop',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './edit-shop.component.html',
  styleUrl: './edit-shop.component.scss',
})
export class EditShopComponent {
  public myForm: FormGroup | any;
  public obj: any;
  public msg: Message[] | any;
  public selectedImage: File | any = null;
  public readingFlag: boolean = false;
  public status: any | undefined = 'Enabled';
  public statusFlag: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      shopName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      officialEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      officialContactNo: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}'),
      ]),
      shopGst: new FormControl('', Validators.required),
      panNo: new FormControl(
        '',
        Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')
      ),
      pinCode: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{6}'),
      ]),
    });
  }

  ngOnInit(): void {
    this.messageHandler('info', 'searching shop details!');
    this.details();
  }

  public submitForm() {
    this.editShopDetails({
      ...this.obj,
      address: this.myForm.value.address,
      shopName: this.myForm.value.shopName,
      officialEmail: this.myForm.value.officialEmail,
      officialContactNo: this.myForm.value.officialContactNo,
      logo: this.selectedImage,
    }).subscribe((ele) => {
      this.messageHandler('success', 'shop edited successfully!');
      this.clearMessagesAfterDelay();
    });
  }

  private details() {
    try {
      this.readingFlag = false;
      this.shopDetails({ id: localStorage.getItem('id') }).subscribe((ele) => {
        this.obj = ele.data;
        this.myForm.patchValue(ele.data);
        if (ele.data.disable) {
          this.status = 'Disabled';
        }
        this.statusFlag = ele.data.disable;
        this.readingFlag = true;
        this.clearMessagesAfterDelay();
      });
    } catch (error) {
      this.messageHandler('error', 'something went wrong');
    }
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

  public trigger() {
    this.activate({ id: localStorage.getItem('id') }).subscribe((ele) => {
      this.messageHandler('success', 'shop activated successfully!');
      this.details();
      this.clearMessagesAfterDelay();
    });
  }

  public trigger2() {
    this.deactivated({ id: localStorage.getItem('id') }).subscribe((ele) => {
      this.messageHandler('success', 'shop Deactivated successfully!');
      this.details();
      this.clearMessagesAfterDelay();
    });
  }

  private activate(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/enable', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private deactivated(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/disable', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private editShopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/edit', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/search', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  public addShop(): void {
    this.router.navigate(['dashboard/addShop']);
  }
}
