import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const loginUrlTree = this.router.createUrlTree(['/login']);
    const session = this.authService.getSession();

    // No session at all - redirect to login
    if (!session?.access_token) {
      console.log('No session found, redirecting to login');
      return of(loginUrlTree);
    }

    // Check if token is expired or about to expire
    if (this.authService.isTokenExpired(session.access_token)) {
      console.log('Token expired or expiring soon, attempting refresh');
      
      // Token has expired, try to refresh it
      return this.authService.refreshToken().pipe(
        switchMap(() => {
          console.log('Token refreshed successfully by guard');
          return of(true);
        }),
        catchError((error) => {
          console.error('Failed to refresh token in guard:', error);
          // Refresh failed - redirect to login
          return of(loginUrlTree);
        })
      );
    }

    // Token is still valid
    return of(true);
  }
}
