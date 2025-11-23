import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommerceService } from '../../../core/services/commerce/commerce.service';
import { CommerceService as AdminCommerceService } from '../../../core/services/admin/commerce.service';
import { Auth as AuthService } from '../../../core/auth/auth';
import { AffiliateSubcursalModel, CommerceAffiliateCreateModel } from '../../../core/models/admin/commerce.model';
import { SubcursalModel } from '../../../core/models/admin/subcursal.model';

@Component({
  selector: 'app-subcursal',
  imports: [CommonModule, FormsModule],
  templateUrl: './subcursal.html',
  styleUrl: './subcursal.css'
})
export class Subcursal implements OnInit {
  private commerceService = inject(CommerceService);
  private adminCommerceService = inject(AdminCommerceService);
  private authService = inject(AuthService);

  subcursales = signal<AffiliateSubcursalModel[]>([]);
  availableSubcursals = signal<any[]>([]);
  loading = signal(false);
  loadingAffiliate = signal(false);
  error = signal<string | null>(null);
  showAffiliateModal = signal(false);
  selectedSubcursalId = signal<number | null>(null);

  ngOnInit() {
    this.loadSubcursales();
  }

  loadSubcursales() {
    const user = this.authService.getUserData();
    if (!user?.id) {
      this.error.set('No se pudo obtener la información del usuario');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.commerceService.getSubcursals(user.id).subscribe({
      next: (subcursales) => {
        console.log('Subcursales cargadas:', subcursales);

        // Validar que los datos estén en el formato correcto
        const validSubcursales = subcursales.filter(item => {
          if (!item || !item.sucursal) {
            console.warn('Subcursal con datos incompletos:', item);
            return false;
          }
          return true;
        });

        if (validSubcursales.length !== subcursales.length) {
          console.warn(`Se filtraron ${subcursales.length - validSubcursales.length} subcursales con datos incompletos`);
        }

        this.subcursales.set(validSubcursales);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading subcursales:', error);
        this.error.set('Error al cargar las subcursales');
        this.loading.set(false);
      }
    });
  }

  getAvailability2R(subcursal: SubcursalModel | undefined): number {
    if (!subcursal) return 0;
    return subcursal.capacity2R - subcursal.current2R;
  }

  getAvailability4R(subcursal: SubcursalModel | undefined): number {
    if (!subcursal) return 0;
    return subcursal.capacity4R - subcursal.current4R;
  }

  getOccupancyPercentage2R(subcursal: SubcursalModel | undefined): number {
    if (!subcursal) return 0;
    return subcursal.capacity2R > 0 ? (subcursal.current2R / subcursal.capacity2R) * 100 : 0;
  }

  getOccupancyPercentage4R(subcursal: SubcursalModel | undefined): number {
    if (!subcursal) return 0;
    return subcursal.capacity4R > 0 ? (subcursal.current4R / subcursal.capacity4R) * 100 : 0;
  }

  getOccupancyStatusClass2R(subcursal: SubcursalModel | undefined): string {
    if (!subcursal) return 'bg-gray-300';
    const percentage = this.getOccupancyPercentage2R(subcursal);
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getOccupancyStatusClass4R(subcursal: SubcursalModel | undefined): string {
    if (!subcursal) return 'bg-gray-300';
    const percentage = this.getOccupancyPercentage4R(subcursal);
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  trackBySubcursal(index: number, item: AffiliateSubcursalModel): number {
    return item.id;
  }

  // Métodos para cálculos de totales
  getTotalCapacity2R(): number {
    return this.subcursales().reduce((total, item) => {
      if (item.sucursal) {
        return total + item.sucursal.capacity2R;
      }
      return total;
    }, 0);
  }

  getTotalCapacity4R(): number {
    return this.subcursales().reduce((total, item) => {
      if (item.sucursal) {
        return total + item.sucursal.capacity4R;
      }
      return total;
    }, 0);
  }

  getTotalCurrentVehicles(): number {
    return this.subcursales().reduce((total, item) => {
      if (item.sucursal) {
        return total + item.sucursal.current2R + item.sucursal.current4R;
      }
      return total;
    }, 0);
  }

  getTotalSubcursales(): number {
    return this.subcursales().length;
  }

  // Métodos para manejar la afiliación de subcursales
  openAffiliateModal() {
    const user = this.authService.getUserData();
    if (!user?.id) {
      this.error.set('No se pudo obtener la información del usuario');
      return;
    }

    this.showAffiliateModal.set(true);
    this.loadAvailableSubcursals(user.id);
  }

  closeAffiliateModal() {
    this.showAffiliateModal.set(false);
    this.selectedSubcursalId.set(null);
    this.availableSubcursals.set([]);
  }

  loadAvailableSubcursals(commerceId: number) {
    this.loading.set(true);
    this.adminCommerceService.getSubcursalsNotAffiliated(commerceId).subscribe({
      next: (subcursals) => {
        this.availableSubcursals.set(subcursals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading available subcursals:', error);
        this.error.set('Error al cargar las subcursales disponibles');
        this.loading.set(false);
      }
    });
  }

  affiliateSubcursal() {
    const user = this.authService.getUserData();
    const subcursalId = this.selectedSubcursalId();

    if (!user?.id || !subcursalId) {
      this.error.set('Datos incompletos para la afiliación');
      return;
    }

    const payload: CommerceAffiliateCreateModel = {
      commerceId: user.id,
      sucursalId: subcursalId
    };

    this.loadingAffiliate.set(true);
    this.error.set(null);

    this.adminCommerceService.affiliateCommerceToSubcursal(payload).subscribe({
      next: (response) => {
        console.log('Afiliación exitosa:', response);
        this.loadingAffiliate.set(false);
        this.closeAffiliateModal();
        this.loadSubcursales(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error en la afiliación:', error);
        this.error.set('Error al afiliar la subcursal');
        this.loadingAffiliate.set(false);
      }
    });
  }
}
