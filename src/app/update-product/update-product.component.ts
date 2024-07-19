import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

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

  search() {
    this.Details().subscribe((ele) => {
      this.products = [];
      const res = this.decrypt.decrypt(ele.response);
      const array = [];
      array.push(res.data);
      this.products = array;
      this.populateForm(this.currentIndex);
    });
  }

  populateForm(index: number) {
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

  next() {
    if (this.currentIndex < this.products.length - 1) {
      this.currentIndex++;
      this.populateForm(this.currentIndex);
    }
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

  submitForm() {
    const product = this.products[this.currentIndex];
    if (!product) return;

    const payload = {
      ...product,
      ProductName: this.myForm.value.ProductName,
      ProductDescription: this.myForm.value.ProductDescription,
      productType: this.myForm.value.productType,
      productImage: this.selectedImage,
      productCost: this.myForm.value.productCost,
    };

    this.editShopDetails(payload).subscribe((response) => {
      response;
    });

    this.search();
  }

  back(): void {
    this.router.navigate(['dashboard/viewProduct']);
  }

  remove() {
    this.delete().subscribe((response) => {
      response;
      this.back();
    });
  }

  onProductCostInput() {
    if (this.myForm.get('productCost')?.value) {
      this.myForm.get('discount')?.disable();
    } else {
      this.myForm.get('discount')?.enable();
    }
  }

  onDiscountInput() {
    if (this.myForm.get('discount')?.value) {
      this.myForm.get('productCost')?.disable();
    } else {
      this.myForm.get('productCost')?.enable();
    }
  }

  async adjust() {
    let originalPrice = this.products[this.currentIndex].productCost;
    originalPrice;
    const cost =
      this.myForm.get('productCost')?.value == originalPrice
        ? 0
        : this.myForm.get('productCost')?.value;
    const discount = this.myForm.get('discount')?.value;

    if (cost > 0) {
      (' i am here');
      this.myForm.patchValue({ productCost: cost });
      let payload = {
        id: localStorage.getItem('currentObjectId'),
        productCost: cost,
      };
      this.adjustRate(payload).subscribe((response) => {
        const data = this.decrypt.decrypt(response.response);
        this.search();
      });
    } else if (discount) {
      ('i am in else');
      const productCost = originalPrice - (originalPrice * discount) / 100;
      await this.myForm.patchValue({ productCost: productCost });
      let payload = {
        id: localStorage.getItem('currentObjectId'),
        productCost: productCost,
      };
      this.adjustRate(payload).subscribe((response) => {
        const data = this.decrypt.decrypt(response.response);
        this.search();
      });
    }
  }

  editShopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  adjustRate(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

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

  Details(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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

  delete(): Observable<any> {
    const id = localStorage.getItem('currentObjectId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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
}
