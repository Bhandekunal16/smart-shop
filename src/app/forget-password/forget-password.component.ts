import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { SettlerService } from '../common/settler.service';

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

  constructor(private router: Router, private settler: SettlerService) {
    this.myForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  submitForm() {
    const gmail: string = this.myForm.value.email;
    this.settler.emailObj=gmail

    if (gmail == '') {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'something went wrong',
        },
      ];
    } else {
      this.verifyOtp();
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'otp send to your email.',
        },
      ];
    }
  }

  verifyOtp(): void {
    this.router.navigate(['/verify-otp']);
  }
}
