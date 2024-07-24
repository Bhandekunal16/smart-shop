import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private statusSubject = new BehaviorSubject<boolean>(this.getInitialStatus());
  status$ = this.statusSubject.asObservable();

  private getInitialStatus(): boolean | any {
    try {
      return localStorage.getItem('status') === 'true';
    } catch (error) {
      console.log('this is not error ');
    }
  }

  toggleStatus() {
    try {
      const currentStatus = this.statusSubject.value;
      const newStatus = !currentStatus;
      localStorage.setItem('status', newStatus.toString());
      this.statusSubject.next(newStatus);
    } catch (error) {
      console.log('this is error ');
    }
  }

  setStatus(status: boolean) {
    try {
      localStorage.setItem('status', status.toString());
      this.statusSubject.next(status);
    } catch (error) {
      console.log('this is not a error ');
    }
  }
}
