import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private statusSubject = new BehaviorSubject<boolean>(this.getInitialStatus());
  status$ = this.statusSubject.asObservable();

  private getInitialStatus(): boolean {
    return localStorage.getItem('status') === 'true';
  }

  toggleStatus() {
    const currentStatus = this.statusSubject.value;
    const newStatus = !currentStatus;
    localStorage.setItem('status', newStatus.toString());
    this.statusSubject.next(newStatus);
  }

  setStatus(status: boolean) {
    localStorage.setItem('status', status.toString());
    this.statusSubject.next(status);
  }
}
