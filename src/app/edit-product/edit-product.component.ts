import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  public shopId: any;
  public obj: any;
  public selectedImage: File | any = null;
  public flag: boolean = false;
  public products: any[] = [];
  public currentIndex = 0;
  public msg: Message[] | any;
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
    });
  }

  ngOnInit(): void {
    this.msg = [
      {
        severity: 'info',
        detail: `searching for your product`,
      },
    ];
    this.Details().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      this.products = res.data;

      this.msg = [
        {
          severity: 'success',
          detail: `product found ${res.data.length}`,
        },
      ];

      this.populateForm(this.currentIndex);

      setTimeout(() => {
        this.msg = [];
      }, 1000);
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
       ('Image uploaded successfully:', this.selectedImage);
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
      productCost: product.productCost,
    };

    this.editShopDetails(payload).subscribe((response) => {
      const res = this.decrypt.decrypt(response.response);
      res.status
        ? (this.msg = [
            {
              severity: 'success',
              summary: 'success',
              detail: `product edited successfully`,
            },
          ])
        : (this.msg = [
            {
              severity: 'warn',
              summary: 'warn',
              detail: `Shop edition failed`,
            },
          ]);
    });
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

  Details(): Observable<any> {
    const id = localStorage.getItem('id');
     (id, 'i am hitting');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`https://smart-shop-api-eta.vercel.app/product/getall/${id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
