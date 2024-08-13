import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';
import { header } from '../string';

@Component({
  selector: 'app-recipt',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipt.component.html',
  styleUrl: './recipt.component.scss',
})
export class ReceptComponent implements OnInit {
  public product: any = {};
  public productName: string | undefined;
  public productDescription: string | undefined;
  public productCost: string | undefined;
  public brand: string | undefined;
  public productId: string | undefined;
  public officialContactNo: string | undefined;
  public officialEmail: string | undefined;
  public address: string | undefined;
  public logo: string | undefined;
  public transactionType: string | undefined;
  public paymentDate: string | undefined;

  constructor(private http: HttpClient, private decrypt: DecryptService) {}

  ngOnInit(): void {
    const product: any = localStorage.getItem('payment');
    const parse = JSON.parse(product);
    this.productName = parse.ProductName;
    this.productDescription = parse.ProductDescription;
    this.productCost = parse.productCost;
    this.brand = parse.brandName;
    this.productId = parse.id;
    this.purchasedList(parse.ownerId).subscribe((ele) => {
      const data = this.decrypt.decrypt(ele.response);
      this.officialContactNo = data.data.officialContactNo;
      this.officialEmail = data.data.officialEmail;
      this.address = data.data.address;
      this.logo = data.data.logo;
    });
    this.TxnList(parse.id).subscribe((ele) => {
      this.transactionType = ele.data.transactionType;
      this.paymentDate = new Date(
        parseInt(ele.data.paymentDate)
      ).toLocaleString();
    });
  }

  private purchasedList(id: any): Observable<any> {
    const headers = header();
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

  private TxnList(id: any): Observable<any> {
    const headers = header();
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
