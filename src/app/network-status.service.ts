import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Logger } from './custom.logs';

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
    try {
      this.onlineStatus.next(navigator.onLine);
    } catch (error) {
      new Logger().error('this is not error ');
    }
  }

  get onlineStatus$() {
    return this.onlineStatus.asObservable();
  }
}
