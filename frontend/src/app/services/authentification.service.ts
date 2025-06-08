import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  // private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  // login(login: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/users/login`, { login, password });
  // const body = {
  //     "item_id": item_id,
  //     "limit": limit
  //   };
  // this.hashPasswordService.hashPassword('monMotDePasse123')
  // .then(hash => console.log('Mot de passe hashé :', hash));
  //   return this.http.post(this.apiUrlOLAP, body);
  // }

  // register(login: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/users/login`, { login, password });
  // const body = {
  //     "item_id": item_id,
  //     "limit": limit
  //   };
  // this.hashPasswordService.hashPassword('monMotDePasse123')
  // .then(hash => console.log('Mot de passe hashé :', hash));
  //   return this.http.post(this.apiUrlOLAP, body);
  // }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  async hashSHA256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
