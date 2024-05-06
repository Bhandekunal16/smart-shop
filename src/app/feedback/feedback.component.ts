import { Component } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    MessagesModule,
    HttpClientModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  public myForm: FormGroup;
  public msg: Message[] | any;

  constructor() {
    this.myForm = new FormGroup({
      email: new FormControl(''),
      message: new FormControl(''),
    });
  }

  submitForm() {
    const email = this.myForm.value.email;
    const message = this.myForm.value.message;

    console.log(email, message);
  }
}
