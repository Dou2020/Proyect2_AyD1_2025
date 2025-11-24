import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiquidationCommerceService } from '../../../core/services/admin/liquidationCommerce.service';
import { LiquidationCommerceModel, LiquidationCommerceDiscount, ParamLiquidationCommerceModel } from '../../../core/models/admin/liquidationCommerce.model';

@Component({
  selector: 'app-liquidation-commerce',
  imports: [CommonModule, FormsModule],
  templateUrl: './liquidation-commerce.html',
  styleUrl: './liquidation-commerce.css'
})
export class LiquidationCommerce implements OnInit {
  liquidationData = signal<LiquidationCommerceModel | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string>('');
  commerceId = signal<number | null>(null);

  // Form data for date range
  startDate = signal<string>('');
  endDate = signal<string>('');

  // Filter for discounts
  filterUsed = signal<string>('all'); // 'all', 'used', 'unused'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liquidationService: LiquidationCommerceService
  ) {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.endDate.set(today.toISOString().split('T')[0]);
    this.startDate.set(thirtyDaysAgo.toISOString().split('T')[0]);
  }

  // Computed property for filtered discounts
  filteredDiscounts = computed(() => {
    const data = this.liquidationData();
    if (!data) return [];

    const filter = this.filterUsed();
    return data.discounts.filter(discount => {
      if (filter === 'used') return discount.used;
      if (filter === 'unused') return !discount.used;
      return true; // 'all'
    });
  });

  // Computed property for used discounts count
  usedDiscountsCount = computed(() => {
    const data = this.liquidationData();
    if (!data) return 0;
    return data.discounts.filter(discount => discount.used).length;
  });

  // Computed property for total discounts count
  totalDiscountsCount = computed(() => {
    const data = this.liquidationData();
    if (!data) return 0;
    return data.discounts.length;
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['commerceId'];
      if (id) {
        this.commerceId.set(id);
        this.loadLiquidationData();
      }
    });
  }

  loadLiquidationData() {
    const commerceId = this.commerceId();
    const start = this.startDate();
    const end = this.endDate();

    if (!commerceId || !start || !end) {
      this.errorMessage.set('Datos incompletos para cargar la liquidación');
      this.clearErrorAfterDelay();
      return;
    }

    const params: ParamLiquidationCommerceModel = {
      startDate: start,
      endDate: end
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.liquidationService.getLiquidation(commerceId, params).subscribe({
      next: (data) => {
        this.liquidationData.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading liquidation data:', error);
        this.errorMessage.set('Error al cargar los datos de liquidación');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  processLiquidation() {
    const commerceId = this.commerceId();
    const start = this.startDate();
    const end = this.endDate();

    if (!commerceId || !start || !end) {
      this.errorMessage.set('Datos incompletos para procesar la liquidación');
      this.clearErrorAfterDelay();
      return;
    }

    const params: ParamLiquidationCommerceModel = {
      startDate: start,
      endDate: end
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.liquidationService.postLiquidation(commerceId, params).subscribe({
      next: (data) => {
        this.liquidationData.set(data);
        this.isLoading.set(false);
        // Mostrar mensaje de éxito
        this.showSuccessMessage('Liquidación procesada exitosamente');
      },
      error: (error) => {
        console.error('Error processing liquidation:', error);
        this.errorMessage.set('Error al procesar la liquidación');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  onDateRangeChange() {
    this.loadLiquidationData();
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterUsed.set(target.value);
  }

  goBack() {
    this.router.navigate(['/admin/subcursales']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateTimeString: string): string {
    return new Date(dateTimeString).toLocaleString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set('');
    }, 5000);
  }

  private showSuccessMessage(message: string) {
    // You can implement a toast notification here
    alert(message);
  }

  getDiscountStatusClass(used: boolean): string {
    return used
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }

  getDiscountStatusText(used: boolean): string {
    return used ? 'Usado' : 'Pendiente';
  }

  trackByDiscountId(index: number, discount: LiquidationCommerceDiscount): number {
    return discount.id;
  }
}
