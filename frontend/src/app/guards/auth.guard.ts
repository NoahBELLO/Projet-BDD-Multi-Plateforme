import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthentificationService) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkCookie().pipe(
      map(response => {
        if (response.loggedIn) {
          return true;
        } else {
          return this.router.parseUrl('/connexion');
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la requête Flag :", error);
        return of(this.router.parseUrl('/connexion'));
      })
    );
  }
}