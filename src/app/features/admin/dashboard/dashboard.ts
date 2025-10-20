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
  // Datos de ejemplo para el dashboard
  totalUsers = 1250;
  activeUsers = 987;
  pendingAlerts = 5;
  totalReports = 45;

  constructor(private alertService: AlertService) {
    // Mostrar mensaje de bienvenida
    this.alertService.showSuccess('Panel de administración cargado correctamente');

    // Aquí podrías cargar datos reales desde un servicio
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

      this.totalUsers = Math.floor(Math.random() * 2000) + 1000;
      this.activeUsers = Math.floor(this.totalUsers * 0.8);
      this.pendingAlerts = Math.floor(Math.random() * 10);
      this.totalReports = Math.floor(Math.random() * 100) + 20;

      // Mostrar alerta si hay muchas alertas pendientes
      if (this.pendingAlerts > 7) {
        this.alertService.showWarning(`Tienes ${this.pendingAlerts} alertas pendientes por revisar`);
      }
    }, 1000);
  }

  // Métodos de ejemplo para demostrar diferentes tipos de alertas
  createUser(): void {
    // Simular creación de usuario
    this.alertService.showInfo('Creando nuevo usuario...');

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.totalUsers++;
        this.alertService.showSuccess('Usuario creado exitosamente');
      } else {
        this.alertService.showError('Error al crear usuario. Email ya existe', 409);
      }
    }, 2000);
  }

  deleteUser(): void {
    if (this.totalUsers > 0) {
      this.totalUsers--;
      this.alertService.showSuccess('Usuario eliminado correctamente');
    } else {
      this.alertService.showWarning('No hay usuarios para eliminar');
    }
  }

  generateReport(): void {
    this.alertService.showInfo('Generando reporte...');

    setTimeout(() => {
      this.totalReports++;
      this.alertService.showSuccess('Reporte generado y enviado a tu email');
    }, 3000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el servidor', 500);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
