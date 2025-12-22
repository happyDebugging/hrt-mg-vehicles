import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('token');
  }

  logout() {
    this.token = null;
    sessionStorage.removeItem('token');
  }
}
