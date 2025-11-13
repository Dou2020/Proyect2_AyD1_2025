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
  // Datos de ejemplo para el dashboard de backoffice
  totalOperations = 850;
  activeProcesses = 42;
  pendingTasks = 8;
  totalReports = 156;

  constructor(private alertService: AlertService) {
    // Mostrar mensaje de bienvenida
    this.alertService.showSuccess('Panel de backoffice cargado correctamente');

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

      this.totalOperations = Math.floor(Math.random() * 1500) + 500;
      this.activeProcesses = Math.floor(Math.random() * 100) + 20;
      this.pendingTasks = Math.floor(Math.random() * 15);
      this.totalReports = Math.floor(Math.random() * 200) + 100;

      // Mostrar alerta si hay muchas tareas pendientes
      if (this.pendingTasks > 10) {
        this.alertService.showWarning(`Tienes ${this.pendingTasks} tareas pendientes por procesar`);
      }
    }, 1000);
  }

  // Métodos de ejemplo para demostrar diferentes tipos de alertas
  processOperation(): void {
    // Simular procesamiento de operación
    this.alertService.showInfo('Procesando operación...');

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.totalOperations++;
        this.alertService.showSuccess('Operación procesada exitosamente');
      } else {
        this.alertService.showError('Error al procesar operación. Datos incompletos', 400);
      }
    }, 2000);
  }

  completeTask(): void {
    if (this.pendingTasks > 0) {
      this.pendingTasks--;
      this.alertService.showSuccess('Tarea completada correctamente');
    } else {
      this.alertService.showWarning('No hay tareas pendientes para completar');
    }
  }

  generateReport(): void {
    this.alertService.showInfo('Generando reporte de backoffice...');

    setTimeout(() => {
      this.totalReports++;
      this.alertService.showSuccess('Reporte generado y enviado');
    }, 3000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el sistema principal', 500);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
