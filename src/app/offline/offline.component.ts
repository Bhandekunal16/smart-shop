import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.scss',
})
export class OfflineComponent {}
