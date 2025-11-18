import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFreeService } from '../../../core/services/admin/baseFree.service';
import { BaseFreeModel, NewValueModel } from '../../../core/models/admin/baseFree.model';

@Component({
  selector: 'app-base-free',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './base-free.html',
  styleUrl: './base-free.css'
})
export class BaseFree implements OnInit {
  baseFees = signal<BaseFreeModel[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  currentBaseFee = signal<BaseFreeModel | null>(null);
  successMessage = signal<string>('');
  baseFeeForm: FormGroup;

  constructor(
    private baseFreeService: BaseFreeService,
    private fb: FormBuilder
  ) {
    this.baseFeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      value: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadBaseFees();
  }

  loadBaseFees() {
    this.isLoading.set(true);
    this.baseFreeService.getBaseFrees().subscribe({
      next: (baseFee) => {
        // Convert single object to array
        this.baseFees.set([baseFee]);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading base fees:', error);
        this.isLoading.set(false);
        // Keep empty array if loading fails
        this.baseFees.set([]);
      }
    });
  }

  openModal(baseFee?: BaseFreeModel) {
    this.isEditing.set(!!baseFee);
    this.currentBaseFee.set(baseFee || null);

    if (baseFee) {
      // When editing, populate form and disable name field since API only accepts value updates
      this.baseFeeForm.patchValue({
        name: baseFee.name,
        value: baseFee.value
      });
      // Disable name field when editing as API only allows value updates
      this.baseFeeForm.get('name')?.disable();
    } else {
      // When creating new (though this might not happen with current API design)
      this.baseFeeForm.reset({
        name: '',
        value: 0
      });
      // Enable name field when creating
      this.baseFeeForm.get('name')?.enable();
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.currentBaseFee.set(null);
    this.successMessage.set('');
    this.baseFeeForm.reset();
    // Re-enable name field when closing modal
    this.baseFeeForm.get('name')?.enable();
  }

  saveBaseFee() {
    if (this.baseFeeForm.invalid) return;

    const formData = this.baseFeeForm.value;
    this.isLoading.set(true);

    // Prepare the payload according to NewValueModel interface
    const payload: NewValueModel = {
      newValue: formData.value
    };

    this.baseFreeService.updateBaseFree(payload).subscribe({
      next: (response) => {
        // Update the existing base fee with the new value
        const currentBaseFee = this.currentBaseFee();
        if (currentBaseFee) {
          // Update existing base fee with new value
          const updatedBaseFee: BaseFreeModel = {
            name: currentBaseFee.name,
            value: response.newValue
          };
          // Immediately update the UI with new data
          this.updateUIWithNewData(updatedBaseFee);
        } else {
          // If creating new (though this might not happen with current API design)
          const newBaseFee: BaseFreeModel = {
            name: formData.name || 'tarifa_base_global',
            value: response.newValue
          };
          this.updateUIWithNewData(newBaseFee);
        }

        this.isLoading.set(false);
        this.successMessage.set('¡Tarifa base actualizada exitosamente!');

        // Close modal after successful update with a small delay for better UX
        setTimeout(() => {
          this.closeModal();
        }, 1000); // Increased delay to show success message

        // Optional: Show success message (you can uncomment if needed)
        // console.log('Tarifa base actualizada exitosamente');
      },
      error: (error) => {
        console.error('Error saving base fee:', error);
        this.isLoading.set(false);
        // Don't close modal on error so user can retry
      }
    });
  }

  /**
   * Refresh the base fee data from the server
   */
  refreshBaseFees() {
    this.loadBaseFees();
  }

  /**
   * Force update the UI with new data and provide visual feedback
   */
  private updateUIWithNewData(updatedBaseFee: BaseFreeModel) {
    // Update the main data array
    this.baseFees.set([updatedBaseFee]);

    // Update the current base fee signal for consistency
    this.currentBaseFee.set(updatedBaseFee);

    // Optional: Trigger change detection for any edge cases
    // This ensures the UI is immediately updated
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(value);
  }

  getFormattedName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
