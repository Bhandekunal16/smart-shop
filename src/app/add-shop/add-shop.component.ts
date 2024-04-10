import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-shop.component.html',
  styleUrl: './add-shop.component.scss',
})
export class AddShopComponent {
  public myForm: FormGroup | any;

  constructor() {
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
      shopGst: new FormControl('', Validators.pattern('[0-9]{15}')),
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

  submitForm() {}
}
