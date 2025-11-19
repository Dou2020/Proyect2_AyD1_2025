import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubcursalService } from '../../../core/services/subcursal.service';
import { SubcursalModel, SubcursalCreateModel, SubcursalUpdateModel } from '../../../core/models/admin/subcursal.model';

@Component({
  selector: 'app-subcursal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subcursal.html',
  styleUrl: './subcursal.css'
})
export class Subcursal implements OnInit {
  subcursals = signal<SubcursalModel[]>([]);
  filteredSubcursals = signal<SubcursalModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  currentSubcursal = signal<SubcursalModel | null>(null);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  subcursalForm: FormGroup;

  constructor(
    private subcursalService: SubcursalService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subcursalForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      initHour: ['', [Validators.required]],
      endHour: ['', [Validators.required]],
      capacity2R: [0, [Validators.required, Validators.min(1)]],
      capacity4R: [0, [Validators.required, Validators.min(1)]],
      // User fields for creation
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      mfaActivated: [false]
    });
  }

  // Computed property for filtered subcursals
  computedFilteredSubcursals = computed(() => {
    const subcursals = this.subcursals();
    const search = this.searchTerm().toLowerCase();

    return subcursals.filter(subcursal => {
      return subcursal.address.toLowerCase().includes(search) ||
             subcursal.appUser.name.toLowerCase().includes(search) ||
             subcursal.appUser.username.toLowerCase().includes(search) ||
             subcursal.appUser.email.toLowerCase().includes(search);
    });
  });

  ngOnInit() {
    this.loadSubcursals();
  }

  loadSubcursals() {
    this.isLoading.set(true);
    this.subcursalService.getSubcursals().subscribe({
      next: (subcursals) => {
        this.subcursals.set(subcursals);
        this.filteredSubcursals.set(this.computedFilteredSubcursals());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading subcursals:', error);
        this.errorMessage.set('Error al cargar las subcursales');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filteredSubcursals.set(this.computedFilteredSubcursals());
  }

  openModal(subcursal?: SubcursalModel) {
    this.isEditing.set(!!subcursal);
    this.currentSubcursal.set(subcursal || null);
    this.clearMessages();

    if (subcursal) {
      // When editing, populate form and disable user fields
      this.subcursalForm.patchValue({
        address: subcursal.address,
        initHour: subcursal.initHour,
        endHour: subcursal.endHour,
        capacity2R: subcursal.capacity2R,
        capacity4R: subcursal.capacity4R
      });

      // Disable user fields when editing
      this.subcursalForm.get('username')?.disable();
      this.subcursalForm.get('name')?.disable();
      this.subcursalForm.get('email')?.disable();
      this.subcursalForm.get('phoneNumber')?.disable();
      this.subcursalForm.get('mfaActivated')?.disable();
    } else {
      // When creating new, reset form and enable all fields
      this.subcursalForm.reset({
        capacity2R: 0,
        capacity4R: 0,
        mfaActivated: false
      });

      // Enable all fields when creating
      this.subcursalForm.get('username')?.enable();
      this.subcursalForm.get('name')?.enable();
      this.subcursalForm.get('email')?.enable();
      this.subcursalForm.get('phoneNumber')?.enable();
      this.subcursalForm.get('mfaActivated')?.enable();
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.currentSubcursal.set(null);
    this.subcursalForm.reset();
    this.clearMessages();
    // Re-enable all fields when closing modal
    Object.keys(this.subcursalForm.controls).forEach(key => {
      this.subcursalForm.get(key)?.enable();
    });
  }

  saveSubcursal() {
    if (this.subcursalForm.invalid) {
      this.markFormGroupTouched(this.subcursalForm);
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    if (this.isEditing()) {
      this.updateSubcursal();
    } else {
      this.createSubcursal();
    }
  }

  private createSubcursal() {
    const formData = this.subcursalForm.getRawValue();

    const payload: SubcursalCreateModel = {
      address: formData.address,
      initHour: formData.initHour,
      endHour: formData.endHour,
      capacity2R: formData.capacity2R,
      capacity4R: formData.capacity4R,
      appUser: {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        mfaActivated: formData.mfaActivated
      }
    };

    this.subcursalService.createSubcursal(payload).subscribe({
      next: (newSubcursal) => {
        this.subcursals.set([...this.subcursals(), newSubcursal]);
        this.filteredSubcursals.set(this.computedFilteredSubcursals());
        this.isLoading.set(false);
        this.successMessage.set('Subcursal creada exitosamente');
        this.clearSuccessAfterDelay();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating subcursal:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Error al crear la subcursal');
        this.clearErrorAfterDelay();
      }
    });
  }

  private updateSubcursal() {
    const currentSubcursal = this.currentSubcursal();
    if (!currentSubcursal) return;

    const formData = this.subcursalForm.value;

    const payload: SubcursalUpdateModel = {
      address: formData.address,
      initHour: formData.initHour,
      endHour: formData.endHour,
      capacity2R: formData.capacity2R,
      capacity4R: formData.capacity4R
    };

    this.subcursalService.updateSubcursal(currentSubcursal.id, payload).subscribe({
      next: (updatedSubcursal) => {
        const subcursals = this.subcursals();
        const index = subcursals.findIndex(s => s.id === updatedSubcursal.id);
        if (index !== -1) {
          subcursals[index] = updatedSubcursal;
          this.subcursals.set([...subcursals]);
          this.filteredSubcursals.set(this.computedFilteredSubcursals());
        }
        this.isLoading.set(false);
        this.successMessage.set('Subcursal actualizada exitosamente');
        this.clearSuccessAfterDelay();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating subcursal:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Error al actualizar la subcursal');
        this.clearErrorAfterDelay();
      }
    });
  }

  deleteSubcursal(subcursal: SubcursalModel) {
    if (confirm(`¿Estás seguro de que deseas eliminar la subcursal en ${subcursal.address}?`)) {
      this.isLoading.set(true);
      this.subcursalService.deleteSubcursal(subcursal.id).subscribe({
        next: () => {
          const subcursals = this.subcursals().filter(s => s.id !== subcursal.id);
          this.subcursals.set(subcursals);
          this.filteredSubcursals.set(this.computedFilteredSubcursals());
          this.isLoading.set(false);
          this.successMessage.set('Subcursal eliminada exitosamente');
          this.clearSuccessAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting subcursal:', error);
          this.isLoading.set(false);
          this.errorMessage.set('Error al eliminar la subcursal');
          this.clearErrorAfterDelay();
        }
      });
    }
  }

  // Helper methods
  private clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  private clearSuccessAfterDelay() {
    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set('');
    }, 5000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Template helper methods
  getFieldError(fieldName: string): string {
    const field = this.subcursalForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${this.getFieldDisplayName(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      address: 'Dirección',
      initHour: 'Hora de inicio',
      endHour: 'Hora de fin',
      capacity2R: 'Capacidad 2 ruedas',
      capacity4R: 'Capacidad 4 ruedas',
      username: 'Usuario',
      name: 'Nombre',
      email: 'Email',
      phoneNumber: 'Teléfono'
    };
    return displayNames[fieldName] || fieldName;
  }

  getOccupancyPercentage(current: number, capacity: number): number {
    return capacity > 0 ? Math.round((current / capacity) * 100) : 0;
  }

  getOccupancyClass(current: number, capacity: number): string {
    const percentage = this.getOccupancyPercentage(current, capacity);
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  }

  isTimeValid(): boolean {
    const initHour = this.subcursalForm.get('initHour')?.value;
    const endHour = this.subcursalForm.get('endHour')?.value;

    if (!initHour || !endHour) return true; // Let required validator handle empty values

    return initHour < endHour;
  }

  viewCommerces(subcursalId: number) {
    this.router.navigate(['/admin/subcursales', subcursalId, 'comercios']);
  }

  viewFees(subcursalId: number) {
    this.router.navigate(['/admin/subcursales', subcursalId, 'tarifas']);
  }
}
