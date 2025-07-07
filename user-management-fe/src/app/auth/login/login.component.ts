import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { selectIsLoading, selectError } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, IftaLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError).pipe(map(e => e ?? null));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email: email ?? '', password: password ?? '' }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
