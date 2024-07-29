import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    HttpClientModule,
    MessagesModule,
    CardModule,
    ImageModule,
    CommonModule,
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    MenubarModule,
    RatingModule,
    ToastModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    InputOtpModule,
  ],
})
export class SharedModule {}
