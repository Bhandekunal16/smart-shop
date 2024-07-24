import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  private onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    navigator.onLine
  );

  constructor() {
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
  }

  private updateOnlineStatus() {
    this.onlineStatus.next(navigator.onLine);
  }

  get onlineStatus$() {
    return this.onlineStatus.asObservable();
  }
}
