import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SubcursalService } from '../../../core/services/subcursal.service';
import { AffiliateCommerceModel } from '../../../core/models/admin/commerce.model';

@Component({
  selector: 'app-commerce',
  imports: [CommonModule],
  templateUrl: './commerce.html',
  styleUrl: './commerce.css'
})
export class Commerce implements OnInit {
  affiliatedCommerces = signal<AffiliateCommerceModel[]>([]);
  filteredCommerces = signal<AffiliateCommerceModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);
  subcursalId = signal<number | null>(null);
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subcursalService: SubcursalService
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
}
