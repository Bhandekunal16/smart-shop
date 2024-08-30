import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-chartline',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chartline.component.html',
  styleUrl: './chartline.component.scss',
})
export class ChartlineComponent {
  constructor() {}
  public data: any;
  public options: any;

  @Input() header: undefined | string;
  @Input() data1: any[] | undefined;
  @Input() data2: any[] | undefined;

  ngOnInit() {
    this.simulate();
  }

  private simulate() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: this.data1,
      datasets: [
        {
          data: this.data2,
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }
}
