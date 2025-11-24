import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubcursalService } from '../../../core/services/subcursal.service';
import { CommerceService } from '../../../core/services/admin/commerce.service';
import { AffiliateCommerceModel, CommerceModel, CommerceAffiliateCreateModel } from '../../../core/models/admin/commerce.model';

@Component({
  selector: 'app-commerce',
  imports: [CommonModule, FormsModule],
  templateUrl: './commerce.html',
  styleUrl: './commerce.css'
})
export class Commerce implements OnInit {
  affiliatedCommerces = signal<AffiliateCommerceModel[]>([]);
  filteredCommerces = signal<AffiliateCommerceModel[]>([]);
  availableCommerces = signal<CommerceModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);
  loadingAffiliate = signal(false);
  subcursalId = signal<number | null>(null);
  errorMessage = signal<string>('');
  showAffiliateModal = signal(false);
  selectedCommerceId = signal<number | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subcursalService: SubcursalService,
    private commerceService: CommerceService
  ) {}

  // Computed property for filtered commerces
  computedFilteredCommerces = computed(() => {
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
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.subcursalId.set(id);
        this.loadAffiliatedCommerces(id);
      }
    });
  }

  loadAffiliatedCommerces(subcursalId: number) {
    this.isLoading.set(true);
    this.subcursalService.getAffiliateCommerces(subcursalId).subscribe({
      next: (commerces) => {
        this.affiliatedCommerces.set(commerces);
        this.filteredCommerces.set(this.computedFilteredCommerces());
        this.isLoading.set(false);
      },
      error: (error) => {
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
    this.filteredCommerces.set(this.computedFilteredCommerces());
  }

  goBack() {
    this.router.navigate(['/admin/subcursales']);
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set('');
    }, 5000);
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

  // Métodos para manejar la afiliación de comercios
  openAffiliateModal() {
    const subcursalId = this.subcursalId();
    if (!subcursalId) {
      this.errorMessage.set('No se pudo obtener el ID de la subcursal');
      this.clearErrorAfterDelay();
      return;
    }

    this.showAffiliateModal.set(true);
    this.loadAvailableCommerces(subcursalId);
  }

  closeAffiliateModal() {
    this.showAffiliateModal.set(false);
    this.selectedCommerceId.set(null);
    this.availableCommerces.set([]);
  }

  loadAvailableCommerces(subcursalId: number) {
    this.isLoading.set(true);
    this.commerceService.getCommerceAll(subcursalId).subscribe({
      next: (commerces) => {
        this.availableCommerces.set(commerces);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading available commerces:', error);
        this.errorMessage.set('Error al cargar los comercios disponibles');
        this.isLoading.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  affiliateCommerce() {
    const subcursalId = this.subcursalId();
    const commerceId = this.selectedCommerceId();

    if (!subcursalId || !commerceId) {
      this.errorMessage.set('Datos incompletos para la afiliación');
      this.clearErrorAfterDelay();
      return;
    }

    const payload: CommerceAffiliateCreateModel = {
      commerceId: commerceId,
      sucursalId: subcursalId
    };

    this.loadingAffiliate.set(true);
    this.errorMessage.set('');

    this.commerceService.affiliateCommerceToSubcursal(payload).subscribe({
      next: (response) => {
        console.log('Afiliación exitosa:', response);
        this.loadingAffiliate.set(false);
        this.closeAffiliateModal();
        this.loadAffiliatedCommerces(subcursalId); // Recargar la lista
      },
      error: (error) => {
        console.error('Error en la afiliación:', error);
        this.errorMessage.set('Error al afiliar el comercio');
        this.loadingAffiliate.set(false);
        this.clearErrorAfterDelay();
      }
    });
  }

  viewLiquidation(commerceId: number) {
    this.router.navigate(['/admin/liquidation-commerce', commerceId]);
  }
}
