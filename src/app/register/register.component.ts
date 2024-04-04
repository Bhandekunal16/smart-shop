import { Component } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

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

  constructor(private router: Router, private api: ApiService) {
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

  async submitForm() {
    const firstName: string = this.myForm.value.firstName;
    const lastName: string = this.myForm.value.lastName;
    const email: string = this.myForm.value.gmail;
    const mobileNo: number = this.myForm.value.mobileNo;
    const password: string = this.myForm.value.Password;

    console.log(firstName, lastName, email, mobileNo, password);

    const create: any = await this.api.register({
      firstName,
      lastName,
      email,
      mobileNo,
      password,
    });

    if (create.data.status) {
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
