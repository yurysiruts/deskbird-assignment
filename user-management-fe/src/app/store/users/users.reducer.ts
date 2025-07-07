import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { User } from '../../core/services/user.service';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
    error: null
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(UsersActions.updateUser, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    isLoading: false,
    error: null
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
); 