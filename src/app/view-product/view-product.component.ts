import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DecryptService } from '../../global/decrypt.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
  public data: any[] = [];
  public value!: number;
  constructor(
    private http: HttpClient,
    private router: Router,
    private decrypt: DecryptService
  ) {}

  ngOnInit(): void {
    this.shopDetails().subscribe((ele) => {
      const res = this.decrypt.decrypt(ele.response);
      this.data = res.data;
    });
  }

  setCurrentObjectId(id: string) {
    console.log(id);
    localStorage.setItem('currentObjectId', id);
    this.edit();
  }

  edit(): void {
    this.router.navigate(['dashboard/updateProduct']);
  }

  getStatusText(isPurchased: boolean): string {
    return isPurchased ? 'Sold' : 'Unsold';
  }

  now(input: string) {
    return `data:image/jpeg;base64,${btoa(input)}`;
  }

  shopDetails(): Observable<any> {
    const id = localStorage.getItem('id');
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

  updateProduct() {}
}
