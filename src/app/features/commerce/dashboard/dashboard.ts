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
  // Datos de ejemplo para el dashboard de comercio
  totalProducts = 342;
  activeProducts = 298;
  todaySales = 15;
  totalRevenue = 4856.75;
  lowStockItems = 8;
  pendingOrders = 12;

  constructor(private alertService: AlertService) {
    // Mostrar mensaje de bienvenida
    this.alertService.showSuccess('Panel de comercio cargado correctamente');

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
        this.alertService.showWarning('Algunos productos están con bajo stock');
      }

      this.totalProducts = Math.floor(Math.random() * 500) + 200;
      this.activeProducts = Math.floor(this.totalProducts * 0.87);
      this.todaySales = Math.floor(Math.random() * 30) + 5;
      this.totalRevenue = Math.floor(Math.random() * 10000) + 2000;
      this.lowStockItems = Math.floor(Math.random() * 15);
      this.pendingOrders = Math.floor(Math.random() * 20) + 5;

      // Mostrar alerta si hay muchos productos con bajo stock
      if (this.lowStockItems > 10) {
        this.alertService.showWarning(`Tienes ${this.lowStockItems} productos con bajo stock`);
      }
    }, 1000);
  }

  // Métodos de ejemplo para demostrar diferentes tipos de alertas
  addProduct(): void {
    // Simular agregar producto
    this.alertService.showInfo('Agregando nuevo producto...');

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.totalProducts++;
        this.activeProducts++;
        this.alertService.showSuccess('Producto agregado exitosamente');
      } else {
        this.alertService.showError('Error al agregar producto. SKU ya existe', 409);
      }
    }, 2000);
  }

  processSale(): void {
    this.alertService.showInfo('Procesando venta...');

    setTimeout(() => {
      this.todaySales++;
      this.totalRevenue += Math.floor(Math.random() * 200) + 50;
      this.alertService.showSuccess('Venta procesada correctamente');
    }, 1500);
  }

  checkInventory(): void {
    this.alertService.showInfo('Verificando inventario...');

    setTimeout(() => {
      const lowStock = Math.floor(Math.random() * 5);
      this.lowStockItems += lowStock;

      if (lowStock > 0) {
        this.alertService.showWarning(`Se encontraron ${lowStock} productos adicionales con bajo stock`);
      } else {
        this.alertService.showSuccess('Inventario verificado - Todo en orden');
      }
    }, 2500);
  }

  generateSalesReport(): void {
    this.alertService.showInfo('Generando reporte de ventas...');

    setTimeout(() => {
      this.alertService.showSuccess('Reporte de ventas generado y enviado a tu email');
    }, 3000);
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el sistema de pagos', 502);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
