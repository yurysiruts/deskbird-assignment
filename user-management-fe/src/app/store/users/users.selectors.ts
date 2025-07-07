import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state?.users || []
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state?.isLoading || false
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state?.error || null
); 