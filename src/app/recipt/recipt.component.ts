import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-recipt',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipt.component.html',
  styleUrl: './recipt.component.scss',
})
export class ReceptComponent implements OnInit {
  product: any = {};
  productName: string | undefined;
  productDescription: string | undefined;
  productCost: string | undefined;
  brand: string | undefined;
  productId: string | undefined;
  officialContactNo: string | undefined;
  officialEmail: string | undefined;
  address: string | undefined;
  logo: string | undefined;
  transactionType: string | undefined;
  paymentDate: string | undefined;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    const product: any = localStorage.getItem('payment');
     (product);
    const parse = JSON.parse(product);
    this.productName = parse.ProductName;
    this.productDescription = parse.ProductDescription;
    this.productCost = parse.productCost;
    this.brand = parse.brandName;
    this.productId = parse.id;

     (this.productName);

     (parse);

    this.purchasedList(parse.ownerId).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
       (data);
      this.officialContactNo = data.data.officialContactNo;
      this.officialEmail = data.data.officialEmail;
      this.address = data.data.address;
      this.logo = data.data.logo;
    });

    this.TxnList(parse.id).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
       (data);
      this.transactionType = data.data.transactionType;
      this.paymentDate = new Date(
        parseInt(data.data.paymentDate)
      ).toLocaleString();
    });
  }

  purchasedList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

     (id);

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/shop/get/shopDetails/${id}`,
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

  TxnList(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

     (id);

    return this.http
      .get<any>(
        `https://smart-shop-api-eta.vercel.app/payment/get/TxnDetails/${id}`,
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
}
