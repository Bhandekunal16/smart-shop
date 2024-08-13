import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DecryptService } from '../global/decrypt.service';

@Injectable()
export class HTTP_INTERCEPTOR implements HttpInterceptor {
  constructor(private decryptService: DecryptService) {}
  private excludedEndpoints: string[] = ['/auth/login', '/auth/register'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('request on:', req.url);
    console.log('method : ', req.method);

    const shouldExclude = this.excludedEndpoints.some((endpoint) =>
      req.url.includes(endpoint)
    );

    if (shouldExclude) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body) {
          try {
            const decrypted = this.decryptService.decrypt(event.body.response);
            return event.clone({ body: decrypted });
          } catch (error) {
            console.error('Decryption failed:', error);
            return event;
          }
        }
        return event;
      }),
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }
}
