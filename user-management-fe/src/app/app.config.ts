import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authReducer } from './store/auth/auth.reducer';
import { usersReducer } from './store/users/users.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { UsersEffects } from './store/users/users.effects';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore({ 
      auth: authReducer,
      users: usersReducer
    }),
    provideEffects([AuthEffects, UsersEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Lara
        }
    })
  ]
};
