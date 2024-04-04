import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-conform-password',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessagesModule, ReactiveFormsModule],
  templateUrl: './conform-password.component.html',
  styleUrl: './conform-password.component.scss',
})
export class ConformPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private router: Router) {
    this.myForm = new FormGroup({
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  submitForm() {
    const password = this.myForm.value.password;

    if (password !== '') {
      this.msg = [
        {
          severity: 'success',
          summary: 'success',
          detail: 'password changed successfully.',
        },
      ];

      this.dashboard();
    } else {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'something went wrong',
        },
      ];
    }
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
