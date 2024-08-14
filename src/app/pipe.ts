import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HTTP_INTERCEPTOR } from './app.interceptor';

export const RequestInterceptor: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HTTP_INTERCEPTOR,
  multi: true,
};
