import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom',
  standalone: true,
  imports: [],
  templateUrl: './bottom.component.html',
  styleUrl: './bottom.component.scss',
})
export class BottomComponent {
  constructor(private router: Router) {}

  public initial(): void {
    this.router.navigate(['dashboard/about']);
  }
}
