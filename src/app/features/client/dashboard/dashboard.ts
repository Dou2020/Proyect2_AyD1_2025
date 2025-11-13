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
  // Datos de ejemplo para el dashboard de cliente
  totalTransactions = 24;
  pendingPayments = 2;
  availableBalance = 1250.75;
  supportTickets = 1;

  constructor(private alertService: AlertService) {
    // Mostrar mensaje de bienvenida
    this.alertService.showSuccess('Panel de Cliente cargado correctamente');

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

      this.totalTransactions = Math.floor(Math.random() * 100) + 10;
      this.pendingPayments = Math.floor(Math.random() * 5);
      this.availableBalance = Math.floor(Math.random() * 5000) + 500;
      this.supportTickets = Math.floor(Math.random() * 3);

      // Mostrar alerta si hay pagos pendientes
      if (this.pendingPayments > 2) {
        this.alertService.showWarning(`Tienes ${this.pendingPayments} pagos pendientes`);
      }
    }, 1000);
  }

  // Métodos de ejemplo para demostrar diferentes tipos de alertas
  makePayment(): void {
    // Simular proceso de pago
    this.alertService.showInfo('Procesando pago...');

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.pendingPayments = Math.max(0, this.pendingPayments - 1);
        this.totalTransactions++;
        this.alertService.showSuccess('Pago procesado exitosamente');
      } else {
        this.alertService.showError('Error al procesar pago. Verifica tus datos', 400);
      }
    }, 2000);
  }

  contactSupport(): void {
    this.alertService.showInfo('Abriendo ticket de soporte...');

    setTimeout(() => {
      this.supportTickets++;
      this.alertService.showSuccess('Ticket de soporte creado. Te contactaremos pronto');
    }, 1500);
  }

  updateProfile(): void {
    this.alertService.showInfo('Actualizando perfil...');

    setTimeout(() => {
      this.alertService.showSuccess('Perfil actualizado correctamente');
    }, 2000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el servidor', 500);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
