import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from '../../../core/services/commerce/discount.service';
import { DiscountModel, DiscountCreateModel, ParamDiscountModel } from '../../../core/models/commerce/discount.model';

@Component({
  selector: 'app-discount',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './discount.html',
  styleUrl: './discount.css'
})
export class Discount implements OnInit {
  discounts = signal<DiscountModel[]>([]);
  selectedDiscount = signal<DiscountModel | null>(null);
  isLoading = signal(false);
  error = signal<string>('');
  success = signal<string>('');

  // Forms
  createForm: FormGroup;
  searchForm: FormGroup;

  // Modal states
  showCreateModal = signal(false);
  showDetailsModal = signal(false);

  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      hours: ['', [Validators.required, Validators.min(1)]],
      ticketIdOrPlate: ['', [Validators.required]]
    });

    this.searchForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      plate: [''],
      ticketId: ['']
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
  }

  // Load all discounts with optional filters
  loadDiscounts(params?: ParamDiscountModel): void {
    this.isLoading.set(true);
    this.error.set('');

    this.discountService.getDiscounts(params).subscribe({
      next: (discounts) => {
        this.discounts.set(discounts);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los descuentos');
        this.isLoading.set(false);
        console.error('Error loading discounts:', err);
      }
    });
  }

  // Search discounts with filters
  onSearch(): void {
    const formValues = this.searchForm.value;
    const params: ParamDiscountModel = {
      startDate: formValues.startDate || null,
      endDate: formValues.endDate || null,
      plate: formValues.plate || null,
      ticketId: formValues.ticketId ? Number(formValues.ticketId) : null
    };

    // Remove null values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== null && value !== '')
    ) as ParamDiscountModel;

    this.loadDiscounts(Object.keys(filteredParams).length > 0 ? filteredParams : undefined);
  }

  // Clear search filters
  clearSearch(): void {
    this.searchForm.reset();
    this.loadDiscounts();
  }

  // Create new discount
  onCreateDiscount(): void {
    if (this.createForm.valid) {
      this.isLoading.set(true);
      this.error.set('');

      const payload: DiscountCreateModel = this.createForm.value;

      this.discountService.createDiscount(payload).subscribe({
        next: (newDiscount) => {
          this.success.set('Descuento creado exitosamente');
          this.createForm.reset();
          this.showCreateModal.set(false);
          this.loadDiscounts(); // Reload the list
          this.isLoading.set(false);

          // Clear success message after 3 seconds
          setTimeout(() => this.success.set(''), 3000);
        },
        error: (err) => {
          this.error.set('Error al crear el descuento');
          this.isLoading.set(false);
          console.error('Error creating discount:', err);
        }
      });
    }
  }

  // Get discount by ID and show details
  viewDiscountDetails(id: number): void {
    this.isLoading.set(true);
    this.error.set('');

    this.discountService.getDiscountById(id).subscribe({
      next: (discount) => {
        this.selectedDiscount.set(discount);
        this.showDetailsModal.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los detalles del descuento');
        this.isLoading.set(false);
        console.error('Error loading discount details:', err);
      }
    });
  }

  // Modal controls
  openCreateModal(): void {
    this.createForm.reset();
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.createForm.reset();
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedDiscount.set(null);
  }

  // Utility methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  }
}
