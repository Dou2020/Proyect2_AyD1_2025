import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemporalTransferService } from '../../../core/services/backoffice/temporalTransfer.service';
import { TemporalTransferModel } from '../../../core/models/backoffice/temporalTransfer.model';

@Component({
  selector: 'app-temporal-transfer',
  imports: [CommonModule, FormsModule],
  templateUrl: './temporal-transfer.html',
  styleUrl: './temporal-transfer.css'
})
export class TemporalTransfer implements OnInit {
  pendingTransfers = signal<TemporalTransferModel[]>([]);
  allTransfers = signal<TemporalTransferModel[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'pending' | 'all'>('pending');

  // Campos de búsqueda
  searchPlate = signal('');
  searchColor = signal('');
  searchType = signal('');

  // Transferencias filtradas usando computed signals
  filteredPendingTransfers = computed(() => {
    return this.filterTransfers(this.pendingTransfers());
  });

  filteredAllTransfers = computed(() => {
    return this.filterTransfers(this.allTransfers());
  });

  constructor(private temporalTransferService: TemporalTransferService) {}

  ngOnInit() {
    this.loadPendingTransfers();
    this.loadAllTransfers();
  }

  loadPendingTransfers() {
    this.isLoading.set(true);
    this.temporalTransferService.getPendingTemporalTransfers().subscribe({
      next: (transfers) => {
        this.pendingTransfers.set(transfers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending transfers:', error);
        this.error.set('Error al cargar transferencias pendientes');
        this.isLoading.set(false);
      }
    });
  }

  loadAllTransfers() {
    this.temporalTransferService.getTemporalTransfers().subscribe({
      next: (transfers) => {
        // Filtrar para excluir los PENDING
        const filteredTransfers = transfers.filter(transfer => transfer.status !== 'PENDING');
        this.allTransfers.set(filteredTransfers);
      },
      error: (error) => {
        console.error('Error loading all transfers:', error);
        this.error.set('Error al cargar transferencias');
      }
    });
  }

  acceptTransfer(transferId: number) {
    this.temporalTransferService.temporalTransferAccept(transferId).subscribe({
      next: () => {
        this.loadPendingTransfers();
        this.loadAllTransfers();
      },
      error: (error) => {
        console.error('Error accepting transfer:', error);
        this.error.set('Error al aceptar la transferencia');
      }
    });
  }

  rejectTransfer(transferId: number) {
    this.temporalTransferService.temporalTransferReject(transferId).subscribe({
      next: () => {
        this.loadPendingTransfers();
        this.loadAllTransfers();
      },
      error: (error) => {
        console.error('Error rejecting transfer:', error);
        this.error.set('Error al rechazar la transferencia');
      }
    });
  }

  banTransfer(transferId: number) {
    if (confirm('¿Está seguro de que desea banear esta transferencia? Esta acción no se puede deshacer.')) {
      this.temporalTransferService.temporalTransferBanned(transferId).subscribe({
        next: () => {
          this.loadPendingTransfers();
          this.loadAllTransfers();
        },
        error: (error) => {
          console.error('Error banning transfer:', error);
          this.error.set('Error al banear la transferencia');
        }
      });
    }
  }

  setActiveTab(tab: 'pending' | 'all') {
    this.activeTab.set(tab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OK': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FINISHED': return 'bg-blue-100 text-blue-800';
      case 'BANNED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Método para filtrar transferencias basado en los criterios de búsqueda
  filterTransfers(transfers: TemporalTransferModel[]): TemporalTransferModel[] {
    const plateFilter = this.searchPlate().toLowerCase();
    const colorFilter = this.searchColor().toLowerCase();
    const typeFilter = this.searchType().toLowerCase();

    if (!plateFilter && !colorFilter && !typeFilter) {
      return transfers;
    }

    return transfers.filter(transfer => {
      // Buscar en ambos vehículos (original y de reemplazo)
      const originalVehicleMatches =
        transfer.originalVehicle.plate.toLowerCase().includes(plateFilter) &&
        transfer.originalVehicle.color.toLowerCase().includes(colorFilter) &&
        transfer.originalVehicle.type.toLowerCase().includes(typeFilter);

      const secondVehicleMatches =
        transfer.secondVehicle.plate.toLowerCase().includes(plateFilter) &&
        transfer.secondVehicle.color.toLowerCase().includes(colorFilter) &&
        transfer.secondVehicle.type.toLowerCase().includes(typeFilter);

      // Retornar true si cualquiera de los dos vehículos coincide con los filtros
      return originalVehicleMatches || secondVehicleMatches;
    });
  }

  // Métodos para limpiar filtros individuales
  clearPlateFilter() {
    this.searchPlate.set('');
  }

  clearColorFilter() {
    this.searchColor.set('');
  }

  clearTypeFilter() {
    this.searchType.set('');
  }

  // Método para limpiar todos los filtros
  clearAllFilters() {
    this.searchPlate.set('');
    this.searchColor.set('');
    this.searchType.set('');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
}
