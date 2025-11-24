import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubcursalService } from '../../../core/services/subcursal.service';
import { AffiliateCommerceModel } from '../../../core/models/admin/commerce.model';
import { SubcursalModel } from '../../../core/models/admin/subcursal.model';

@Component({
  selector: 'app-liquidations-overview',
  imports: [CommonModule, FormsModule],
  templateUrl: './liquidations-overview.html',
  styleUrl: './liquidations-overview.css'
})
export class LiquidationsOverview implements OnInit {
  subcursales = signal<SubcursalModel[]>([]);
  affiliatedCommerces = signal<AffiliateCommerceModel[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string>('');
  searchTerm = signal('');
  selectedSubcursal = signal<number | null>(null);

  constructor(
    private router: Router,
    private subcursalService: SubcursalService
  ) {}

  // Computed property for filtered commerces
  filteredCommerces = computed(() => {
    const commerces = this.affiliatedCommerces();
    const search = this.searchTerm().toLowerCase();

    return commerces.filter(affiliate => {
      const commerce = affiliate.commerce;
      return commerce.name.toLowerCase().includes(search) ||
             commerce.email.toLowerCase().includes(search) ||
             commerce.username.toLowerCase().includes(search) ||
             commerce.phoneNumber.toLowerCase().includes(search);
    });
  });

  ngOnInit() {
    this.loadSubcursales();
  }

  loadSubcursales() {
    this.isLoading.set(true);
    this.subcursalService.getSubcursals().subscribe({
      next: (subcursales: SubcursalModel[]) => {
        this.subcursales.set(subcursales);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading subcursales:', error);
        this.errorMessage.set('Error al cargar las subcursales');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  onSubcursalChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const subcursalId = target.value ? +target.value : null;
    this.selectedSubcursal.set(subcursalId);

    if (subcursalId) {
      this.loadCommercesForSubcursal(subcursalId);
    } else {
      this.affiliatedCommerces.set([]);
    }
  }

  loadCommercesForSubcursal(subcursalId: number) {
    this.isLoading.set(true);
    this.subcursalService.getAffiliateCommerces(subcursalId).subscribe({
      next: (commerces: AffiliateCommerceModel[]) => {
        this.affiliatedCommerces.set(commerces);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading affiliated commerces:', error);
        this.errorMessage.set('Error al cargar los comercios afiliados');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  viewLiquidation(commerceId: number) {
    this.router.navigate(['/admin/liquidation-commerce', commerceId]);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status || 'Desconocido';
    }
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set('');
    }, 5000);
  }
}
