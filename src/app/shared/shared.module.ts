import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';

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
    ChartModule,
    MenubarModule,
    RatingModule,
    ToastModule,
  ],
})
export class SharedModule {}
