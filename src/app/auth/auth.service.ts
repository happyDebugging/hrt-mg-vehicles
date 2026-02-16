import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isRefreshing = false;
  private refreshInProgress$ = new Subject<boolean>();
  public tokenExpired$ = new BehaviorSubject<boolean>(false);
  public tokenRefreshed$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.session) {
          this.saveSession(response.session);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    const session = this.getSession();
    if (!session?.access_token) {
      return false;
    }
    return !this.isTokenExpired(session.access_token);
  }

  // Check if token needs immediate refresh (within buffer period)
  shouldRefreshToken(): boolean {
    const session = this.getSession();
    if (!session?.access_token || !session?.refresh_token) {
      return false;
    }
    return this.isTokenExpired(session.access_token);
  }

  saveSession(session: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('supabase_session', JSON.stringify(session))
    }
  }

  getSession() {
    if (!isPlatformBrowser(this.platformId)) return null
    const session = localStorage.getItem('supabase_session')
    return session ? JSON.parse(session) : null
  }

  // Decode JWT token to check expiration
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired or about to expire (within 5 minute buffer)
  isTokenExpired(token?: string): boolean {
    if (!token) {
      const session = this.getSession();
      token = session?.access_token;
    }

    if (!token) {
      return true;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      // Check if token will expire in the next 5 minutes (300 seconds)
      // This provides a good buffer for proactive refresh
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferSeconds = 5 * 60; // 5 minute buffer
      return decoded.exp < (currentTime + bufferSeconds);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Refresh the JWT token
  refreshToken(): Observable<any> {
    // If refresh is already in progress, prevent duplicate calls
    if (this.isRefreshing) {
      return new Observable(observer => {
        const subscription = this.refreshInProgress$.subscribe({
          next: (isComplete: boolean) => {
            if (isComplete) {
              observer.next(null);
              observer.complete();
              subscription.unsubscribe();
            }
          },
          error: (err) => {
            observer.error(err);
            subscription.unsubscribe();
          }
        });
      });
    }

    this.isRefreshing = true;
    const session = this.getSession();

    if (!session?.refresh_token) {
      this.isRefreshing = false;
      this.handleTokenExpiration();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/refresh`, { refresh_token: session.refresh_token }).pipe(
      tap((response: any) => {
        if (response.session) {
          this.saveSession(response.session);
          this.tokenExpired$.next(false);
          this.tokenRefreshed$.next(true);
          console.log('Token refreshed successfully');
        }
      }),
      catchError((error: any) => {
        console.error('Token refresh failed:', error);
        this.handleTokenExpiration();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
        this.refreshInProgress$.next(true);
      })
    );
  }

  // Handle token expiration - clear session and redirect to login
  private handleTokenExpiration() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('supabase_session');
      this.tokenExpired$.next(true);
      console.log('Token expired. Redirecting to login.');
      // Use a setTimeout to ensure state updates are processed first
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 100);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('supabase_session');
    }
    this.router.navigate(['/login']);
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => {
        return throwError(() => new Error('Logout failed'));
      })
    );
  }
}




// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = environment.apiUrl;

//   constructor(private http: HttpClient) { }

//   login(email: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { email, password });
//   }

//   isBrowser(): boolean {
//     return typeof window !== 'undefined';
//   }

//   getSession(): any {
//     if (this.isBrowser()) {
//       const session = localStorage.getItem('supabase_session');
//       return session ? JSON.parse(session) : null;
//     }
//     return null; // server-side: no session
//   }

//   saveSession(session: any) {
//     if (this.isBrowser()) {
//       localStorage.setItem('supabase_session', JSON.stringify(session));
//     }
//   }


//   isLoggedIn(): boolean {
//     const session = this.getSession();
//     return !!session?.access_token;
//   }

//   logout() {
//     if (this.isBrowser()) {
//       localStorage.removeItem('supabase_session');
//     }
//   }

//   getAuthHeaders(): HttpHeaders {
//     const session = this.getSession();
//     return new HttpHeaders({
//       Authorization: session ? `Bearer ${session.access_token}` : '',
//     });
//   }

//   // Example: secure API call
//   getUserData(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/user-data`, {
//       headers: this.getAuthHeaders(),
//     });
//   }
// }
