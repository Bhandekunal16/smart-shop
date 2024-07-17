import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  public shopId: any;
  public selectedImage: File | any = null;
  public flag: boolean = false;
  public options: string[] | any = [
    'Grocery',
    'Clothing',
    'Electronics',
    'Bookstore',
    'Pharmacy',
    'Furniture',
    'Sports',
    'Jewelry',
    'Beauty',
    'Home Improvement',
    'Pet Supplies',
    'Toys',
    'Automotive',
    'Other',
  ];
  public myForm: FormGroup | any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private decrypt: DecryptService
  ) {
    this.myForm = new FormGroup({
      ProductName: new FormControl('', Validators.required),
      ProductDescription: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      productCost: new FormControl('', Validators.required),
      units: new FormControl('', Validators.required),
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

  submitForm() {
    const ProductName = this.myForm.value.ProductName;
    const ProductDescription = this.myForm.value.ProductDescription;
    const productType = this.myForm.value.productType;
    const productCost = this.myForm.value.productCost;
    const units = this.myForm.value.units;
    const productImage = this.selectedImage;
    const id = localStorage.getItem('shopId');

    console.log(
      ProductName,
      ProductDescription,
      productType,
      productImage,
      productCost,
      units,
      id
    );

    const body = {
      ProductName,
      ProductDescription,
      productType,
      productImage,
      id,
      productCost,
      units,
    };

    this.create(body).subscribe((ele) => console.log(ele));
    this.myForm.reset();
  }

  ngOnInit(): void {
    this.details();
  }

  details() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('id');

      this.shopDetails({ id }).subscribe((ele) => {
        console.log(ele);
        const res = this.decrypt.decrypt(ele.response);
        localStorage.setItem('shopId', res.data.id);
      });
      return this.shopId;
    } else {
      console.error('LocalStorage is not available in this environment.');
    }
  }

  create(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/product/create', body, { headers })
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
      .post<any>('https://smart-shop-api-eta.vercel.app/shop/search', body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
