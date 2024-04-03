import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MessagesModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private router: Router) {
    this.myForm = new FormGroup({
      Username: new FormControl(''),
      Password: new FormControl(''),
    });
  }

  submitForm() {
    const Username: string = this.myForm.value.Username;
    const Password: string = this.myForm.value.Password;

    console.log(Username, Password);

    if (
      (Username === '8779143048' && Password === 'Rowdy@1720') ||
      (Username === 'bhandekunal16@gmail.com' && Password === '172000')
    ) {
      console.log(`login true`);
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'login successfully !',
        },
      ];
      this.dashboard();
    } else {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'please check login credential !',
        },
      ];
      console.log(`login false`);
    }
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  forgetPassword(): void {
    this.router.navigate(['/forget-password']);
  }
}
