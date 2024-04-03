import { Component } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MessagesModule, ReactiveFormsModule, ButtonModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor(private router: Router) {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      gmail: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
    });
  }

  submitForm() {
    const firstName: string = this.myForm.value.firstName;
    const lastName: string = this.myForm.value.lastName;
    const gmail: string = this.myForm.value.gmail;
    const mobileNo: string = this.myForm.value.mobileNo;
    const Password: string = this.myForm.value.Password;

    console.log(firstName, lastName, gmail, mobileNo, Password);

    if (firstName && lastName && gmail && mobileNo && Password !== '') {
      this.msg = [
        {
          severity: 'success',
          summary: 'Success',
          detail: 'register successfully !',
        },
      ];
      this.dashboard();
    } else {
      this.msg = [
        {
          severity: 'warn',
          summary: 'warn',
          detail: 'please fill all fields',
        },
      ];
    }
  }

  login() {
    this.router.navigate(['']);
  }

  dashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
