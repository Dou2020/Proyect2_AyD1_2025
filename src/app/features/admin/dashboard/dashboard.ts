import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../utils/alert-modal/alert.service';
import { DashboardService } from '../../../core/services/admin/dashboard.service';
import { DashboardModel, DashboardSucursalModel, SucursalStat } from '../../../core/models/admin/dashboard.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  // Subscriptions
  private routeSubscription: Subscription = new Subscription();

  // Datos del dashboard
  dashboardData: DashboardModel | null = null;
  sucursalData: DashboardSucursalModel | null = null;
  isLoading = true;
  selectedSucursalId: number | null = null;

  // Propiedades para mostrar en la UI
  ingresos = 0;
  egresos = 0;
  generado = 0;
  actual2R = 0;
  actual4R = 0;
  tiempoPromedio = 0;
  sucursalStats: SucursalStat[] = [];

  constructor(
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.alertService.showSuccess('Panel de administración cargado correctamente');

    // Subscribe to route parameter changes for dynamic updates
    this.routeSubscription = this.route.params.subscribe(params => {
      const sucursalId = params['sucursalId'] || params['id'];
      if (sucursalId && Number(sucursalId) !== this.selectedSucursalId) {
        this.selectedSucursalId = Number(sucursalId);
        this.loadSucursalData(this.selectedSucursalId);
      } else if (!sucursalId && this.selectedSucursalId) {
        this.selectedSucursalId = null;
        this.loadGeneralDashboard();
      } else if (!sucursalId) {
        this.loadGeneralDashboard();
      }
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Verificar si hay un ID de sucursal en los parámetros de la ruta
    const sucursalId = this.route.snapshot.params['sucursalId'] || this.route.snapshot.params['id'];

    if (sucursalId) {
      this.selectedSucursalId = Number(sucursalId);
      this.loadSucursalData(this.selectedSucursalId);
    } else {
      this.loadGeneralDashboard();
    }
  }

  private loadGeneralDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data: DashboardModel) => {
        this.dashboardData = data;
        this.updateDisplayValues(data);
        this.sucursalStats = data.sucursalStats || [];
        this.isLoading = false;
        this.alertService.showSuccess('Datos del dashboard cargados correctamente');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading dashboard data:', error);
        this.alertService.showError('Error al cargar los datos del dashboard', error.status || 500);
      }
    });
  }

  private loadSucursalData(sucursalId: number): void {
    this.dashboardService.getDashboardSucursal(sucursalId).subscribe({
      next: (data: DashboardSucursalModel) => {
        this.sucursalData = data;
        this.updateDisplayValues(data);
        this.isLoading = false;
        this.alertService.showSuccess(`Datos de la sucursal ${sucursalId} cargados correctamente`);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading sucursal data:', error);
        this.alertService.showError(`Error al cargar los datos de la sucursal ${sucursalId}`, error.status || 500);
      }
    });
  }

  private updateDisplayValues(data: DashboardModel | DashboardSucursalModel): void {
    this.ingresos = data.ingresos;
    this.egresos = data.egresos;
    this.generado = data.generado;
    this.actual2R = data.actual2R;
    this.actual4R = data.actual4R;
    this.tiempoPromedio = data.tiempoPromedio;
  }

  // Método para cambiar a vista de sucursal específica
  viewSucursalDetails(sucursalId: number): void {
    this.router.navigate(['/admin/dashboard/sucursal', sucursalId]);
  }

  // Método para actualizar datos de sucursal
  updateSucursalData(sucursalId: number): void {
    this.dashboardService.getDashboardSucursales(sucursalId).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Datos de sucursal actualizados correctamente');
        // Recargar los datos generales después de la actualización
        this.loadGeneralDashboard();
      },
      error: (error) => {
        console.error('Error updating sucursal data:', error);
        this.alertService.showError('Error al actualizar los datos de la sucursal', error.status || 500);
      }
    });
  }

  // Método para volver al dashboard general
  viewGeneralDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  // Método para refrescar datos
  refreshData(): void {
    this.alertService.showInfo('Actualizando datos...');
    this.loadDashboardData();
  }

  // Getters para compatibilidad con la plantilla existente
  get totalUsers(): number {
    return this.ingresos;
  }

  get activeUsers(): number {
    return this.egresos;
  }

  get pendingAlerts(): number {
    return this.actual2R;
  }

  get totalReports(): number {
    return this.actual4R;
  }

  // Métodos para demostrar funcionalidades (adaptados)
  createUser(): void {
    this.alertService.showInfo('Función no implementada en esta versión');
  }

  deleteUser(): void {
    this.alertService.showInfo('Función no implementada en esta versión');
  }

  generateReport(): void {
    this.alertService.showInfo('Generando reporte...');
    setTimeout(() => {
      this.alertService.showSuccess('Reporte generado y enviado a tu email');
    }, 3000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el servidor', 500);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
