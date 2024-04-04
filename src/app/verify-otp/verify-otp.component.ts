import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ButtonModule, CommonModule, MessagesModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  public msg: Message[] | any;
  public myForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  submitForm() {
    const otp: string = this.myForm.value.otp;

    console.log(otp)

    if (otp == '0000') {
      this.msg = [
        {
          severity: 'success',
          summary: 'success',
          detail: 'otp-verified',
        },
      ];
      this.conformPassword()
    } else {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'check again',
        },
      ];
    }
  }

  conformPassword(): void {
    this.router.navigate(['/conform-password']);
  }
}
