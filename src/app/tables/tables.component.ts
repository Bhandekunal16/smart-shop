import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  @Input() data: any[]=[];
  @Input() header: any[] = [];
}
