import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

let token = localStorage.getItem('token');
let user = null;

if (token) {
  try {
    user = jwtDecode(token);
  } catch (error) {
    localStorage.removeItem('token');
    token = null;
  }
}

export const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }))
); 