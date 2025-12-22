import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = '/.netlify/functions';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getUsers() {
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/users`, { headers });
  }

  hello() {
    return this.http.get(`${this.apiUrl}/hello`);
  }
}
