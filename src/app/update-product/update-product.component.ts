import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { options } from '../string';
import { header } from '../string';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent {
  public shopId: any;
  public obj: any;
  public selectedImage: File | any = null;
  public flag: boolean = false;
  public products: any[] = [];
  public currentIndex = 0;
  public options: string[] | any = options;
  public myForm: FormGroup | any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private decrypt: DecryptService
  ) {
    this.myForm = this.fb.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      productType: ['', Validators.required],
      productImage: ['', Validators.required],
      productCost: ['', Validators.required],
      discount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.search();
  }

  private search() {
    this.Details().subscribe((ele) => {
      this.products = [];
      const array = [];
      array.push(ele.data);
      this.products = array;
      this.populateForm(this.currentIndex);
    });
  }

  private populateForm(index: number) {
    const product = this.products[index];
    if (product) {
      this.myForm.patchValue({
        ProductDescription: product.ProductDescription,
        ProductName: product.ProductName,
        productType: product.productType,
        productImage: product.productImage,
        productCost: product.productCost,
      });
    }
  }

  public async onImageSelected(event: any) {
    try {
      const [file, maxSize] = [event.target.files[0], 2 * 1024 * 1024];
      if (file.size > maxSize) {
        alert('File size exceeds 2MB limit.');
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

  public submitForm() {
    const product = this.products[this.currentIndex];
    if (!product) return;
    this.editShopDetails({
      ...product,
      ProductName: this.myForm.value.ProductName,
      ProductDescription: this.myForm.value.ProductDescription,
      productType: this.myForm.value.productType,
      ProductImageBase: this.selectedImage,
      productCost: this.myForm.value.productCost,
    }).subscribe((response) => {
      this.search();
    });
  }

  public remove() {
    this.delete();
    this.back();
  }

  public onProductCostInput() {
    this.myForm.get('productCost')?.value
      ? this.myForm.get('discount')?.disable()
      : this.myForm.get('discount')?.enable();
  }

  public onDiscountInput() {
    this.myForm.get('discount')?.value
      ? this.myForm.get('productCost')?.disable()
      : this.myForm.get('productCost')?.enable();
  }

  public async adjust() {
    let originalPrice = this.products[this.currentIndex].productCost;
    const cost =
      this.myForm.get('productCost')?.value == originalPrice
        ? 0
        : this.myForm.get('productCost')?.value;
    const discount = this.myForm.get('discount')?.value;
    if (cost > 0) {
      this.myForm.patchValue({ productCost: cost });
      this.adjustRate({
        id: localStorage.getItem('currentObjectId'),
        productCost: cost,
      }).subscribe((response) => {
        this.timekeeper();
      });
    } else if (discount) {
      await this.myForm.patchValue({
        productCost: originalPrice - (originalPrice * discount) / 100,
      });
      this.adjustRate({
        id: localStorage.getItem('currentObjectId'),
        productCost: originalPrice - (originalPrice * discount) / 100,
      });
    }
  }

  private editShopDetails(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>('https://smart-shop-api-eta.vercel.app/product/edit', body, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private adjustRate(body: any): Observable<any> {
    const headers = header();
    return this.http
      .post<any>(
        'https://smart-shop-api-eta.vercel.app/product/adjust/rate',
        body,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/get/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private delete(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = header();
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/delete/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private timekeeper() {
    setTimeout(() => {
      this.search();
    }, 5000);
  }

  private back(): void {
    this.router.navigate(['dashboard/viewProduct']);
  }
}
