import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthentificationService } from '../services/authentification.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthentificationService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.includes('/connexion') || req.url.includes('/register') || req.url.includes('/check')) {
          console.log("dans la condition")
          return throwError(() => error);
        }
        if (error.status === 401) {
          const info: Object = {}
          return this.authService.refreshToken(info).pipe(
            switchMap(() => {
              this.router.navigate(['/accueil']);
              return throwError(() => error);
            }),
            catchError(() => {
              this.router.navigate(['/connexion']);
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}