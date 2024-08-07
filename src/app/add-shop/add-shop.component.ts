import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { LocalStorageNotFound } from '../string';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-shop.component.html',
  styleUrl: './add-shop.component.scss',
})
export class AddShopComponent {
  public myForm: FormGroup | any;
  public msg: Message[] | any;
  public selectedImage: File | any = null;
  public flag: boolean = false;
  public sending: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      ShopName: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
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
    this.details();
  }

  public submitForm() {
    const shopName = this.myForm.value.ShopName;
    const address = this.myForm.value.Address;
    const officialEmail = this.myForm.value.officialEmail;
    const officialContactNo = this.myForm.value.officialContactNo;
    const shopGst = this.myForm.value.shopGst;
    const panNo = this.myForm.value.panNo;
    const pinCode = this.myForm.value.pinCode;
    const logo = this.selectedImage;

    this.sending = false;

    this.create({
      logo,
      shopName,
      address,
      officialContactNo,
      officialEmail,
      panNo,
      shopGst,
      pinCode,
      id: localStorage.getItem('id'),
    }).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);
      this.sending = true;

      res.status
        ? this.messageHandler('success', 'shop added successfully.', 'success')
        : this.messageHandler('warn', 'some addition failed.', 'warn');

      this.clearMessagesAfterDelay();
    });

    this.myForm.reset();
  }

  public async onImageSelected(event: any) {
    try {
      const [file, maxSize] = [event.target.files[0], 1 * 1024 * 1024];

      if (file.size > maxSize) {
        this.messageHandler('warn', 'File size exceeds MB limit.');
        event.target.value = '';
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

  private details() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('id');
      this.shopDetails(id).subscribe((ele) => {
        const res = this.decrypt.decrypt(ele.response);
        res.status ? (this.flag = true) : (this.flag = false);
      });
    } else LocalStorageNotFound();
  }

  public create(body: any): Observable<any> {
    const headers = this.header();

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/create', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private shopDetails(id: any): Observable<any> {
    const headers = this.header();

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

  public viewShop(): void {
    this.router.navigate(['dashboard/viewShop']);
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.msg = [];
    }, 1000);
  }

  private messageHandler(severity: string, detail: string, summary?: string) {
    this.msg = [{ severity: severity, detail: detail, summary: summary }];
  }

  private header() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
