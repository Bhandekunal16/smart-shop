import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-shop',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './add-shop.component.html',
  styleUrl: './add-shop.component.scss',
})
export class AddShopComponent {
  submitForm() {}
}
