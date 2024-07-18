import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    HttpClientModule,
    MessagesModule,
    CardModule,
    ImageModule,
    CommonModule,
  ],
})
export class SharedModule {}
