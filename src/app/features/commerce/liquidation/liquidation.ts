import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiquidationService } from '../../../core/services/commerce/liquidation.service';
import { LiquidationModel, ParamLiquidationModel, Discount } from '../../../core/models/commerce/liquidation.model';

@Component({
  selector: 'app-liquidation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liquidation.html',
  styleUrl: './liquidation.css'
})
export class Liquidation implements OnInit {
  private liquidationService = inject(LiquidationService);
  private formBuilder = inject(FormBuilder);

  liquidationForm: FormGroup;
  liquidationData = signal<LiquidationModel | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.liquidationForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Set default dates (last month)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    this.liquidationForm.patchValue({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }

  onGetLiquidation() {
    if (this.liquidationForm.invalid) {
      this.error.set('Por favor, complete todas las fechas requeridas');
      return;
    }

    const params: ParamLiquidationModel = this.liquidationForm.value;
    this.loading.set(true);
    this.error.set(null);

    this.liquidationService.getLiquidation(params).subscribe({
      next: (data) => {
        this.liquidationData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al obtener la liquidación: ' + (err.error?.message || err.message));
        this.loading.set(false);
      }
    });
  }

  onCreateLiquidation() {
    if (this.liquidationForm.invalid) {
      this.error.set('Por favor, complete todas las fechas requeridas');
      return;
    }

    const params: ParamLiquidationModel = this.liquidationForm.value;
    this.loading.set(true);
    this.error.set(null);

    this.liquidationService.createLiquidation(params).subscribe({
      next: (data) => {
        this.liquidationData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al crear la liquidación: ' + (err.error?.message || err.message));
        this.loading.set(false);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-GT');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-GT');
  }

  trackByDiscountId(index: number, discount: Discount): number {
    return discount.id;
  }
}
