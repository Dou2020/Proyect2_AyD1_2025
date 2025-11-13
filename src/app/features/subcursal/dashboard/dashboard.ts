import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../utils/alert-modal/alert.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // Datos de ejemplo para el dashboard de sucursal
  totalServices = 48;
  activeClients = 127;
  pendingRequests = 6;
  completedToday = 12;

  constructor(private alertService: AlertService) {
    // Mostrar mensaje de bienvenida
    this.alertService.showSuccess('Panel de Sucursal cargado correctamente');

    // Cargar datos del dashboard
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Simular carga de datos con manejo de errores
    setTimeout(() => {
      // Simular diferentes escenarios
      const random = Math.random();

      if (random < 0.1) {
        // 10% de probabilidad de error
        this.alertService.showError('Error al cargar algunos datos del dashboard', 500);
      } else if (random < 0.2) {
        // 10% de probabilidad de advertencia
        this.alertService.showWarning('Algunos servicios están experimentando demoras');
      }

      this.totalServices = Math.floor(Math.random() * 100) + 30;
      this.activeClients = Math.floor(Math.random() * 200) + 80;
      this.pendingRequests = Math.floor(Math.random() * 15);
      this.completedToday = Math.floor(Math.random() * 25) + 5;

      // Mostrar alerta si hay muchas solicitudes pendientes
      if (this.pendingRequests > 10) {
        this.alertService.showWarning(`Tienes ${this.pendingRequests} solicitudes pendientes por atender`);
      }
    }, 1000);
  }

  // Métodos de ejemplo para demostrar diferentes tipos de alertas
  processService(): void {
    // Simular procesamiento de servicio
    this.alertService.showInfo('Procesando servicio...');

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.completedToday++;
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        this.alertService.showSuccess('Servicio procesado exitosamente');
      } else {
        this.alertService.showError('Error al procesar servicio. Documentación incompleta', 400);
      }
    }, 2000);
  }

  registerClient(): void {
    this.alertService.showInfo('Registrando nuevo cliente...');

    setTimeout(() => {
      this.activeClients++;
      this.alertService.showSuccess('Cliente registrado correctamente en el sistema');
    }, 1500);
  }

  generateReport(): void {
    this.alertService.showInfo('Generando reporte de sucursal...');

    setTimeout(() => {
      this.alertService.showSuccess('Reporte generado y enviado al administrador');
    }, 3000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el sistema central', 500);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
