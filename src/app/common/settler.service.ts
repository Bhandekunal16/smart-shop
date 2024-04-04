import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettlerService {
  constructor() {}

  private email: string = '';

  get emailObj(): string {
    return this.email;
  }

  set emailObj(value: string) {
    this.email = value;
  }
}
