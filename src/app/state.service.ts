import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Logger } from './custom.logs';

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
      new Logger().error('this is not error ');
    }
  }

  toggleStatus() {
    try {
      const currentStatus = this.statusSubject.value;
      const newStatus = !currentStatus;
      localStorage.setItem('status', newStatus.toString());
      this.statusSubject.next(newStatus);
    } catch (error) {
      new Logger().error('this is error ');
    }
  }

  setStatus(status: boolean) {
    try {
      localStorage.setItem('status', status.toString());
      this.statusSubject.next(status);
    } catch (error) {
      new Logger().error('this is not a error ');
    }
  }
}
