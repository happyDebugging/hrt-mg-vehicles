import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://hrt-vehicles-worker.happydebugging.workers.dev/'

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}`, {
      email,
      password,
    })
  }

  saveSession(session: any) {
    localStorage.setItem('supabase_session', JSON.stringify(session))
  }

  getSession() {
    const session = localStorage.getItem('supabase_session')
    return session ? JSON.parse(session) : null
  }

  logout() {
    localStorage.removeItem('supabase_session')
  }
}
