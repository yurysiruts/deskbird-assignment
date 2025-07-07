import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  
  displayDialog = false;
  selectedUser: User | null = null;
  editForm;

  roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.users$ = this.store.select(selectUsers);
    this.isLoading$ = this.store.select(selectUsersLoading);
    this.error$ = this.store.select(selectUsersError);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.currentUser$ = this.store.select(selectUser);
    
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

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