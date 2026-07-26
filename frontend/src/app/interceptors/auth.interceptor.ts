import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('access_token');
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
      const isExpired = err.error?.expired === true;

      if (err.status !== 401 || isAuthRoute || !isExpired) {
        if (err.status === 401 && !isAuthRoute) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => err);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshedToken$.next(null);

        return authService.refresh().pipe(
          switchMap((res) => {
            isRefreshing = false;
            refreshedToken$.next(res.access_token);
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access_token}` }
            });
            return next(retried);
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return refreshedToken$.pipe(
        filter((newToken) => newToken !== null),
        take(1),
        switchMap((newToken) => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(retried);
        })
      );
    })
  );
};