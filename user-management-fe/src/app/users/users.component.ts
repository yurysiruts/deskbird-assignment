import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, tap, take } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { User } from '../core/services/user.service';
import { selectUsers, selectUsersLoading, selectUsersError } from '../store/users/users.selectors';
import { selectIsAdmin, selectUser } from '../store/auth/auth.selectors';
import * as UsersActions from '../store/users/users.actions';
import * as AuthActions from '../store/auth/auth.actions';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    TooltipModule,
    EditUserDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  
  users$: Observable<User[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  error$: Observable<string | null> = this.store.select(selectUsersError);
  isAdmin$: Observable<boolean> = this.store.select(selectIsAdmin);
  currentUser$: Observable<User | null> = this.store.select(selectUser);
  
  displayDialog = false;
  selectedUser: User | null = null;
  editForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });

  roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.displayDialog = true;
  }

  onDialogSave(userData: Partial<User>) {
    if (this.selectedUser) {
      const editedUser = this.selectedUser;
      this.store.dispatch(UsersActions.updateUser({ 
        id: editedUser.id, 
        userData 
      }));
      this.displayDialog = false;
      this.selectedUser = null;

      this.currentUser$.pipe(take(1)).subscribe(currentUser => {
        const isSelfEdit = currentUser && editedUser && editedUser.email === currentUser.email;
        const isRoleDemoted = userData.role === 'user';
        if (isSelfEdit && isRoleDemoted) {
          this.logout();
        }
      });
    }
  }

  onDialogCancel() {
    this.displayDialog = false;
    this.selectedUser = null;
  }

  logout() {
    console.log('logout');
    this.store.dispatch(AuthActions.logout());
  }
} 