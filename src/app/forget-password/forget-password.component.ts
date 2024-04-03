import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, MessagesModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private router: Router) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  submitForm() {
    const gmail: string = this.myForm.value.email;

    if (gmail == '') {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'something went wrong',
        },
      ];
    } else {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'otp send to your email.',
        },
      ];
    }
  }
}
