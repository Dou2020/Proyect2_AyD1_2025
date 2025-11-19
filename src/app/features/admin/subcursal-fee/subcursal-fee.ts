import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubcursalFeeService } from '../../../core/services/admin/subcursalFee.service';
import { SubcursalFreeModel, SubcursalFreeCreateModel } from '../../../core/models/admin/subcursalFree.model';

@Component({
  selector: 'app-subcursal-fee',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subcursal-fee.html',
  styleUrl: './subcursal-fee.css'
})
export class SubcursalFee implements OnInit {
  fees = signal<SubcursalFreeModel[]>([]);
  filteredFees = signal<SubcursalFreeModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  currentFee = signal<SubcursalFreeModel | null>(null);
  subcursalId = signal<number | null>(null);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  feeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subcursalFeeService: SubcursalFeeService,
    private fb: FormBuilder
  ) {
    this.feeForm = this.fb.group({
      initHour: ['', [Validators.required]],
      endHour: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Computed property for filtered fees
  computedFilteredFees = computed(() => {
    const fees = this.fees();
    const search = this.searchTerm().toLowerCase();

    return fees.filter(fee => {
      return fee.initHour.toLowerCase().includes(search) ||
             fee.endHour.toLowerCase().includes(search) ||
             fee.price.toString().includes(search);
    });
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.subcursalId.set(id);
        this.loadSubcursalFees(id);
      }
    });
  }

  loadSubcursalFees(subcursalId: number) {
    this.isLoading.set(true);
    this.subcursalFeeService.getSubcursalFees(subcursalId).subscribe({
      next: (fees) => {
        this.fees.set(fees);
        this.filteredFees.set(this.computedFilteredFees());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading subcursal fees:', error);
        this.errorMessage.set('Error al cargar las tarifas');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filteredFees.set(this.computedFilteredFees());
  }

  openModal(fee?: SubcursalFreeModel) {
    this.isEditing.set(!!fee);
    this.currentFee.set(fee || null);
    this.clearMessages();

    if (fee) {
      // When editing, populate form
      this.feeForm.patchValue({
        initHour: fee.initHour,
        endHour: fee.endHour,
        price: fee.price
      });
    } else {
      // When creating, reset form
      this.feeForm.reset();
      this.feeForm.patchValue({
        initHour: '',
        endHour: '',
        price: 0
      });
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.currentFee.set(null);
    this.feeForm.reset();
    this.clearMessages();
  }

  saveFee() {
    if (this.feeForm.valid && this.subcursalId()) {
      const subcursalId = this.subcursalId()!;
      const feeData: SubcursalFreeCreateModel = this.feeForm.value;

      if (!this.isTimeValid()) {
        this.errorMessage.set('La hora de inicio debe ser menor que la hora de fin');
        this.clearErrorAfterDelay();
        return;
      }

      this.isLoading.set(true);

      if (this.isEditing() && this.currentFee()) {
        // Update existing fee
        this.subcursalFeeService.updateSubcursalFee(this.currentFee()!.id, subcursalId, feeData).subscribe({
          next: (updatedFee) => {
            this.updateFeeInList(updatedFee);
            this.successMessage.set('Tarifa actualizada exitosamente');
            this.closeModal();
            this.isLoading.set(false);
            this.clearSuccessAfterDelay();
          },
          error: (error) => {
            console.error('Error updating fee:', error);
            this.errorMessage.set('Error al actualizar la tarifa');
            this.isLoading.set(false);
            this.clearErrorAfterDelay();
          }
        });
      } else {
        // Create new fee
        this.subcursalFeeService.createSubcursalFee(subcursalId, feeData).subscribe({
          next: (newFee) => {
            this.fees.update(fees => [...fees, newFee]);
            this.filteredFees.set(this.computedFilteredFees());
            this.successMessage.set('Tarifa creada exitosamente');
            this.closeModal();
            this.isLoading.set(false);
            this.clearSuccessAfterDelay();
          },
          error: (error) => {
            console.error('Error creating fee:', error);
            this.errorMessage.set('Error al crear la tarifa');
            this.isLoading.set(false);
            this.clearErrorAfterDelay();
          }
        });
      }
    } else {
      this.errorMessage.set('Por favor, complete todos los campos requeridos');
      this.clearErrorAfterDelay();
    }
  }

  deleteFee(fee: SubcursalFreeModel) {
    if (confirm(`¿Está seguro de eliminar la tarifa de ${fee.initHour} - ${fee.endHour}?`)) {
      this.isLoading.set(true);
      this.subcursalFeeService.deleteSubcursalFee(fee.id).subscribe({
        next: () => {
          this.fees.update(fees => fees.filter(f => f.id !== fee.id));
          this.filteredFees.set(this.computedFilteredFees());
          this.successMessage.set('Tarifa eliminada exitosamente');
          this.isLoading.set(false);
          this.clearSuccessAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting fee:', error);
          this.errorMessage.set('Error al eliminar la tarifa');
          this.isLoading.set(false);
          this.clearErrorAfterDelay();
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/subcursales']);
  }

  // Helper methods
  private updateFeeInList(updatedFee: SubcursalFreeModel) {
    this.fees.update(fees =>
      fees.map(fee => fee.id === updatedFee.id ? updatedFee : fee)
    );
    this.filteredFees.set(this.computedFilteredFees());
  }

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

  getFieldError(fieldName: string): string | null {
    const field = this.feeForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['min']) {
        return 'El valor debe ser mayor a 0';
      }
    }
    return null;
  }

  isTimeValid(): boolean {
    const initHour = this.feeForm.get('initHour')?.value;
    const endHour = this.feeForm.get('endHour')?.value;

    if (!initHour || !endHour) return true; // Let required validator handle empty values

    return initHour < endHour;
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  }
}
