import { Component } from '@angular/core';
import { ChartlineComponent } from "../chartline/chartline.component";
import { ChartProductComponent } from "../chart-product/chart-product.component";

@Component({
  selector: 'app-charthead',
  standalone: true,
  imports: [ChartlineComponent, ChartProductComponent],
  templateUrl: './charthead.component.html',
  styleUrl: './charthead.component.scss'
})
export class ChartheadComponent {

}
