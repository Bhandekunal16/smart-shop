import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { Message } from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { StateService } from '../state.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-view-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-product.component.html',
  styleUrl: './customer-view-product.component.scss',
})
export class CustomerViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  public msg: Message[] | any;
  public showButton: boolean = false;
  public screen: boolean | undefined;
  public flag: boolean | any;
  public myForm: FormGroup | any;
  public loader: boolean = true;
  public skip: number = 0;
  public limit: number = 10;
  public selectedValue: string | undefined;

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
    'Office Supplies',
    'Garden',
    'Music',
    'Movies',
    'Video Games',
    'Health & Wellness',
    'Baby Products',
    'Crafts',
    'Outdoor Equipment',
    'Tools',
    'Bags & Accessories',
    'Footwear',
    'Bedding',
    'Kitchenware',
    'Stationery',
    'Groceries & Food',
    'Cleaning Supplies',
    'Party Supplies',
    'Travel',
    'Watches',
    'Eyewear',
    'Art Supplies',
    'Fitness Equipment',
    'Building Materials',
    'Lighting',
    'Electrical',
    'Plumbing',
    'Heating & Cooling',
    'Seasonal Decor',
    'Cameras & Photography',
    'Computers & Accessories',
    'Phones & Accessories',
    'Smart Home Devices',
    'Musical Instruments',
    'Books & Magazines',
    'Board Games',
    'Luggage',
    'Hiking & Camping Gear',
    'Marine & Water Sports',
    'Fishing Equipment',
    'Cycling Gear',
    'Skateboarding',
    'Winter Sports',
    'Yoga & Pilates',
    'Personal Care',
    'Wine & Spirits',
    'Office Furniture',
    'Safety & Security',
    'Industrial Equipment',
    'Educational Supplies',
    'Gift Cards',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService,
    private statusService: StateService
  ) {
    this.myForm = new FormGroup({
      productType: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.statusService.status$.subscribe((status) => {
      this.flag = status;
    });
    this.msg = [
      {
        severity: 'info',
        summary: 'Searching product for you!',
      },
    ];
    this.changer();
    this.search();
  }

  search() {
    this.loader = false;
    this.shopDetails({ skip: this.skip, limit: this.limit }).subscribe(
      (ele) => {
        const res = this.decrypt.decrypt(ele.response);

        this.loader = true;

        this.data = res.data;

        this.msg = [
          {
            severity: 'success',
            summary: `products found ${this.data.length}`,
          },
        ];

        setTimeout(() => {
          this.msg = [];
        }, 1000);
      }
    );
  }

  onViewShop(id: any) {
    localStorage.setItem('viewShopId', id);
    this.viewShop();
  }

  now(input: string) {
    return btoa(input);
  }

  clearSelection() {
    this.myForm.get('productType')?.setValue('');
    this.selectedValue = '';
    this.skip = 0;
    this.search();
  }

  changer() {
    const Screen = window.innerWidth;
    Screen < 600 ? (this.screen = true) : (this.screen = false);
  }

  edit(): void {
    this.router.navigate(['customer-dashboard/updateRating']);
  }

  view(): void {
    this.router.navigate(['customer-dashboard/userViewWishList']);
  }

  viewShop(): void {
    this.router.navigate(['customer-dashboard/viewShop']);
  }

  paymentRoute(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.router.navigate(['customer-dashboard/payment']);
  }

  setCurrentObjectId(id: string) {
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  add() {
    this.skip += 10;

    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      productType: this.selectedValue,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      this.loader = true;

      this.data = res.data;

      this.msg = [
        {
          severity: 'success',
          summary: `products found ${this.data.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  decries() {
    this.skip == 0 ? 0 : (this.skip -= 10);

    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      productType: this.selectedValue,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      this.loader = true;

      this.data = res.data;

      this.msg = [
        {
          severity: 'success',
          summary: `products found ${this.data.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  selectItem(event: Event) {
    this.loader = false;
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedValue = selectedValue;

    this.shopDetails({
      skip: this.skip,
      limit: this.limit,
      productType: selectedValue,
    }).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      this.loader = true;

      this.data = res.data;

      this.msg = [
        {
          severity: 'success',
          summary: `products found ${this.data.length}`,
        },
      ];

      setTimeout(() => {
        this.msg = [];
      }, 1000);
    });
  }

  remove(id: any) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };
    this.Remove(body).subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);

      if (res.status) {
        this.search();
      }
    });
  }

  Remove(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/product/wishlist/remove`,
        id,
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

  shopDetails(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(
        `https://smart-shop-api-eta.vercel.app/product/customer/get`,
        body,
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

  WishList(id: string) {
    const userId = localStorage.getItem('id');
    const body = {
      userId: userId,
      productId: id,
    };

    this.Add(body).subscribe((ele) => {
      let res = this.decrypt.decrypt(ele.response);

      if (res.status) {
        this.msg = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'add to wish list',
          },
        ];
        this.view();
        this.showButton = false;
      } else {
        this.msg = [
          {
            severity: 'warn',
            summary: 'warn',
            detail: res.response,
          },
        ];
        this.showButton = true;
      }
    });
  }

  Add(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(`https://smart-shop-api-eta.vercel.app/product/wishlist`, id, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
