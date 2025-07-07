import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { User } from '../../core/services/user.service';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() user: User | null = null;
  @Input() roles: { label: string; value: string }[] = [];
  @Input() disabled = false;
  @Output() save = new EventEmitter<Partial<User>>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;
  originalRole: string | null = null;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        role: this.user.role
      });
      this.originalRole = this.user.role;
    }
    if (changes['visible'] && !this.visible) {
      this.editForm.reset();
      this.originalRole = null;
    }
  }

  onSave() {
    if (this.disabled) {
      return;
    }
    if (this.editForm.valid) {
      const newRole = this.editForm.get('role')?.value;
      if (this.originalRole && newRole !== this.originalRole) {
        const confirmed = window.confirm('Are you sure you want to change the user\'s role?');
        if (!confirmed) {
          return;
        }
      }
      this.save.emit(this.editForm.value);
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 