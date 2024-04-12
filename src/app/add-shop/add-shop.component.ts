import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MessagesModule,
    HttpClientModule,
  ],
  templateUrl: './add-shop.component.html',
  styleUrl: './add-shop.component.scss',
})
export class AddShopComponent {
  public myForm: FormGroup | any;
  public msg: Message[] | any;
  public selectedImage: File | any = null;
  public flag: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.myForm = new FormGroup({
      ShopName: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
      officialEmail: new FormControl('', [
        Validators.required,
        Validators.email,
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

    console.log(body);

    this.create(body).subscribe((data) => {
      console.log(data.data);

      if (data.status) {
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
    console.log(file);
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
    const id = localStorage.getItem('id');

    this.shopDetails({ id }).subscribe((ele) => {
      this.flag = true;
    });
  }

  create(body: any): Observable<any> {
    console.log(body);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('http://localhost:3003/shop/create', body, { headers })
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
      .post<any>('http://localhost:3003/shop/search', body, { headers })
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
