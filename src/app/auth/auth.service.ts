import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
  }

  isLoggedIn(): boolean {
    const session = this.getSession();
    return !!session?.access_token;
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('supabase_session');
      this.router.navigate(['/auth']);
    }
    return this.http.post(`${this.apiUrl}/logout`, {});
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
