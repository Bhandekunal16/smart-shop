import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

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
  public flag: boolean = true;

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

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    try {
      this.selectedImage = await this.uploadFile(file);
      console.log('Image uploaded successfully:', this.selectedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  submitForm() {
    const shopName = this.myForm.value.ShopName;
    const address = this.myForm.value.Address;
    const officialEmail = this.myForm.value.officialEmail;
    const officialContactNo = this.myForm.value.officialContactNo;
    const shopGst = this.myForm.value.shopGst;
    const panNo = this.myForm.value.panNo;
    const pinCode = this.myForm.value.pinCode;
    const logo = this.selectedImage;

    const body = {
      logo,
      shopName,
      address,
      officialContactNo,
      officialEmail,
      panNo,
      shopGst,
      pinCode,
      id: localStorage.getItem('id'),
    };

    this.create(body).subscribe((data) => {
      const res = this.decrypt.decrypt(data.response);
      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'success',
            detail: 'shop added successfully.',
          },
        ];
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: 'some addition failed.',
          },
        ];
      }
    });

    this.myForm.reset();
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

  details() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('id');
      this.shopDetails({ id }).subscribe((ele) => {
        const res = this.decrypt.decrypt(ele.response);
        res.status ? (this.flag = true) : (this.flag = false);
      });
    } else {
      console.error('LocalStorage is not available in this environment.');
    }
  }

  create(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  viewShop(): void {
    this.router.navigate(['dashboard/viewShop']);
  }
}
