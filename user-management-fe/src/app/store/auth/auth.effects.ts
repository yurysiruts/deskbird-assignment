import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthEffects {
  login$;
  loginSuccess$;
  logout$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ email, password }) =>
          this.authService.login(email, password).pipe(
            map((response: any) => {
              const decodedToken = jwtDecode(response.token) as any;
              localStorage.setItem('token', response.token);
              return AuthActions.loginSuccess({ 
                token: response.token, 
                user: decodedToken 
              });
            }),
            catchError((error) => of(AuthActions.loginFailure({ 
              error: error.error?.message || 'Login failed' 
            })))
          )
        )
      )
    );

    this.loginSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/users']))
      ),
      { dispatch: false }
    );

    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }),
        map(() => AuthActions.logoutSuccess())
      )
    );
  }
} 