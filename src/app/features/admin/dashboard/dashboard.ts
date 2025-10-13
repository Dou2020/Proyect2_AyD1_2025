import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  constructor() {
    // Aquí podrías cargar datos reales desde un servicio
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Simular carga de datos
    // En una aplicación real, aquí harías llamadas a servicios
    setTimeout(() => {
      this.totalUsers = Math.floor(Math.random() * 2000) + 1000;
      this.activeUsers = Math.floor(this.totalUsers * 0.8);
      this.pendingAlerts = Math.floor(Math.random() * 10);
      this.totalReports = Math.floor(Math.random() * 100) + 20;
    }, 1000);
  }
}
