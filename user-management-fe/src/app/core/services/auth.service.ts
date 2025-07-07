import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface AuthResponse {
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => ({ token: response.access_token }))
      );
  }
}
