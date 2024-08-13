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
  private excludedEndpoints: string[] = [
    '/auth/login',
    '/auth/register',
    'product/count',
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('HTTP Request:', req);

    const shouldExclude = this.excludedEndpoints.some((endpoint) =>
      req.url.includes(endpoint)
    );

    if (shouldExclude) {
      // If the request URL is excluded, skip decryption and return the original response
      return next.handle(req);
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body) {
          try {
            console.log(event.body.response);
            const decrypted = this.decryptService.decrypt(event.body.response);
            // const decryptedData = this.decryptService.decrypt(
            //   event.body.response
            // );
            console.log('Decrypted Response:', decrypted);

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
