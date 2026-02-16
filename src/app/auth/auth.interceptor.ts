import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interceptor for auth endpoints
    if (request.url.includes('/login') || request.url.includes('/logout') || request.url.includes('/refresh')) {
      return next.handle(request);
    }

    // Add token to request headers if available
    const session = this.authService.getSession();
    const token = session?.access_token;
    
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // Handle 401 (Unauthorized) errors
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          const newToken = this.authService.getSession()?.access_token;
          this.refreshTokenSubject.next(newToken);

          if (newToken) {
            // Retry the original request with the new token
            return next.handle(this.addToken(request, newToken));
          } else {
            return throwError(() => new Error('No new token available'));
          }
        }),
        catchError((error: any) => {
          this.isRefreshing = false;
          console.error('Token refresh failed in interceptor:', error);
          // Token refresh failed - AuthService will handle redirect to login
          return throwError(() => error);
        })
      );
    } else {
      // Wait for token refresh to complete, then retry with new token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token!));
        }),
        catchError((error: any) => {
          console.error('Error retrying request after token refresh:', error);
          return throwError(() => error);
        })
      );
    }
  }
}
