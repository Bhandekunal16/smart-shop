import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public myForm: FormGroup;

  constructor() {
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
      (Username === '8779143048' && Password === '172000') ||
      (Username === 'bhandekunal16@gmail.com' && Password === '172000')
    ) {
      console.log(true);
    } else {
      console.log(false);
    }
  }
}
