import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

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
  public readingFlag: boolean | undefined;
  public status: any | undefined;
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

  submitForm() {
    let payload = {
      ...this.obj,
      address: this.myForm.value.address,
      shopName: this.myForm.value.shopName,
      officialEmail: this.myForm.value.officialEmail,
      officialContactNo: this.myForm.value.officialContactNo,
      logo: this.selectedImage,
    };

    this.editShopDetails(payload).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop edited successfully!',
        },
      ];
    });
  }

  ngOnInit(): void {
    this.details();
  }

  details() {
    try {
      const id = localStorage.getItem('id');

      this.shopDetails({ id }).subscribe((ele) => {
        const res = this.decrypt.decrypt(ele.response);
        console.log(res);

        this.myForm.value.shopName == ''
          ? (this.readingFlag = true)
          : (this.readingFlag = false);

        this.myForm.patchValue(res.data);

        this.status = !res.data.disable ? 'Disabled' : 'Enabled';
        this.statusFlag = res.data.disable;

        this.obj = res.data;
      });
    } catch (error) {
      console.warn('this is warning of localhost');
    }
  }

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  editShopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    try {
      this.selectedImage = await this.uploadFile(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  trigger() {
    const id = localStorage.getItem('id');
    this.activate({ id }).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop activated successfully!',
        },
      ];

      this.details();
    });
  }

  trigger2() {
    const id = localStorage.getItem('id');
    this.deactivated({ id }).subscribe((ele) => {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'shop Deactivated successfully!',
        },
      ];

      this.details();
    });
  }

  activate(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  deactivated(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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
}
