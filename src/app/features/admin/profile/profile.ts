import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth as AuthService } from '../../../core/auth/auth';
import { ProfileService } from '../../../core/services/admin/profile.service';
import { AppUser } from '../../../core/models/public/appUser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user = signal<AppUser | null>(null);
  isLoading = signal(false);
  isEditing = signal(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  profileForm: FormGroup;

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      mfaActivated: [false]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getUserData();
    if (currentUser) {
      this.user.set(currentUser);
      this.populateForm(currentUser);
    }
  }

  populateForm(userData: AppUser) {
    this.profileForm.patchValue({
      name: userData.name,
      lastname: userData.lastname,
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      mfaActivated: userData.mfaActivated || false
    });
  }

  enableEdit() {
    this.isEditing.set(true);
    this.clearMessages();
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.clearMessages();
    const currentUser = this.user();
    if (currentUser) {
      this.populateForm(currentUser);
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      this.errorMessage.set('No se encontraron datos del usuario');
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    const formData = this.profileForm.value;
    const updatedUserData: Partial<AppUser> = {
      name: formData.name,
      lastname: formData.lastname,
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      mfaActivated: formData.mfaActivated
    };

    this.profileService.updateProfile(currentUser.id.toString(), updatedUserData).subscribe({
      next: (response) => {
        // Update the user data in local storage and component state
        const updatedUser: AppUser = {
          ...currentUser,
          ...updatedUserData,
          updatedAt: new Date()
        };

        this.authService.saveUserData(updatedUser);
        this.user.set(updatedUser);
        this.isEditing.set(false);
        this.isLoading.set(false);
        this.successMessage.set('Perfil actualizado exitosamente');

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Error al actualizar el perfil. Por favor, intenta de nuevo.');

        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage.set('');
        }, 5000);
      }
    });
  }

  private clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato de teléfono inválido';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Nombre',
      lastname: 'Apellido',
      username: 'Usuario',
      email: 'Email',
      phoneNumber: 'Teléfono'
    };
    return displayNames[fieldName] || fieldName;
  }

  getRoleBadgeClass(): string {
    const role = this.user()?.role;
    const roleClasses = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'CLIENT': 'bg-blue-100 text-blue-800',
      'COMMERCE': 'bg-green-100 text-green-800',
      'SUCURSAL': 'bg-orange-100 text-orange-800',
      'BACKOFFICE': 'bg-gray-100 text-gray-800'
    };
    return roleClasses[role as keyof typeof roleClasses] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
