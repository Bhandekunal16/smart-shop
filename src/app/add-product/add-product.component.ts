import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [SharedModule],
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
  const maxSize = 2 * 1024 * 1024; 

  if (file.size > maxSize) {
    alert('File size exceeds 2MB limit.');
    event.target.value = ''; // Clear the input
    return;
  }

  try {
    this.selectedImage = await this.convertToWebPAndBinaryString(file);
  } catch (error) {
    console.error('Error processing image:', error);
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

  submitForm() {
    const ProductName = this.myForm.value.ProductName;
    const ProductDescription = this.myForm.value.ProductDescription;
    const productType = this.myForm.value.productType;
    const productCost = this.myForm.value.productCost;
    const units = this.myForm.value.units;
    const productImage = this.selectedImage;
    const id = localStorage.getItem('shopId');

    const body = {
      ProductName,
      ProductDescription,
      productType,
      productImage,
      id,
      productCost,
      units,
    };

    this.create(body).subscribe((ele) => ele);
    this.myForm.reset();
  }

  ngOnInit(): void {
    this.details();
  }

  details() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('id');

      this.shopDetails({ id }).subscribe((ele) => {
        ele;
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
      .post<any>('https://smart-shop-api-eta.vercel.app/product/create', body, {
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
}
