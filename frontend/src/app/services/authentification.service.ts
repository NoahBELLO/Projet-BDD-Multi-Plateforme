import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = 'http://localhost:3001/authentification/';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isLoggedIn();
  }

  login(body: object): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, body, { withCredentials: true }).pipe(
      tap(() => this.isLoggedIn())
    );;
  }

  register(body: object): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, body, { withCredentials: true }).pipe(
      tap(() => this.isLoggedIn())
    );;
  }

  refreshToken(body: object): Observable<any> {
    return this.http.post(`${this.apiUrl}refresh`, body, { withCredentials: true }).pipe(
      tap(() => this.isLoggedIn())
    );;
  }

  checkCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}check`, { withCredentials: true });
  }

  isLoggedIn(): void {
    this.checkCookie().subscribe({
      next: (response) => {
        this.loggedInSubject.next(!!response.loggedIn);
      },
      error: () => {
        this.loggedInSubject.next(false);
      }
    });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}logout`, {}, { withCredentials: true }).subscribe(() => {
      this.loggedInSubject.next(false);
    });
  }

  async hashSHA256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
