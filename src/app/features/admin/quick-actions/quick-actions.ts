import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../utils/alert-modal/alert.service';

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.scss'
})
export class QuickActions {

  actions = [
    {
      title: 'Agregar Usuario',
      description: 'Crear nuevo usuario en el sistema',
      icon: 'user-plus',
      color: 'blue',
      route: '/admin/usuarios',
      action: () => this.navigateToUsers()
    },
    {
      title: 'Gestionar Sucursales',
      description: 'Administrar sucursales existentes',
      icon: 'building',
      color: 'green',
      route: '/admin/subcursales',
      action: () => this.navigateToSucursales()
    },
    {
      title: 'Ver Reportes',
      description: 'Generar y consultar reportes',
      icon: 'chart',
      color: 'purple',
      route: '/admin/reportes',
      action: () => this.navigateToReports()
    },
    {
      title: 'Tarifas Base',
      description: 'Configurar tarifas del sistema',
      icon: 'dollar',
      color: 'yellow',
      route: '/admin/tarifas-base',
      action: () => this.navigateToTarifas()
    },
    {
      title: 'Gestionar Grupos',
      description: 'Administrar grupos de trabajo',
      icon: 'users',
      color: 'indigo',
      route: '/admin/grupos',
      action: () => this.navigateToGroups()
    },
    {
      title: 'Liquidaciones',
      description: 'Ver liquidaciones generales',
      icon: 'calculator',
      color: 'red',
      route: '/admin/liquidaciones',
      action: () => this.navigateToLiquidations()
    },
    {
      title: 'Dashboard',
      description: 'Ver estadísticas generales',
      icon: 'dashboard',
      color: 'gray',
      route: '/admin/dashboard',
      action: () => this.navigateToDashboard()
    },
    {
      title: 'Mi Perfil',
      description: 'Actualizar información personal',
      icon: 'profile',
      color: 'pink',
      route: '/admin/perfil',
      action: () => this.navigateToProfile()
    }
  ];

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  navigateToUsers(): void {
    this.router.navigate(['/admin/usuarios']);
    this.alertService.showInfo('Redirigiendo a gestión de usuarios...');
  }

  navigateToSucursales(): void {
    this.router.navigate(['/admin/subcursales']);
    this.alertService.showInfo('Redirigiendo a gestión de sucursales...');
  }

  navigateToReports(): void {
    this.router.navigate(['/admin/reportes']);
    this.alertService.showInfo('Redirigiendo a reportes...');
  }

  navigateToTarifas(): void {
    this.router.navigate(['/admin/tarifas-base']);
    this.alertService.showInfo('Redirigiendo a tarifas base...');
  }

  navigateToGroups(): void {
    this.router.navigate(['/admin/grupos']);
    this.alertService.showInfo('Redirigiendo a gestión de grupos...');
  }

  navigateToLiquidations(): void {
    this.router.navigate(['/admin/liquidaciones']);
    this.alertService.showInfo('Redirigiendo a liquidaciones...');
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
    this.alertService.showInfo('Redirigiendo al dashboard...');
  }

  navigateToProfile(): void {
    this.router.navigate(['/admin/perfil']);
    this.alertService.showInfo('Redirigiendo a mi perfil...');
  }

  executeAction(action: any): void {
    action.action();
  }

  getIconSvg(iconType: string): string {
    const icons: { [key: string]: string } = {
      'user-plus': 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      'building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'chart': 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      'calculator': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      'dashboard': 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
      'profile': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    };
    return icons[iconType] || icons['dashboard'];
  }

  getColorClasses(color: string): { bg: string, text: string, hover: string, border: string } {
    const colors: { [key: string]: { bg: string, text: string, hover: string, border: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50', border: 'border-purple-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'hover:bg-yellow-50', border: 'border-yellow-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50', border: 'border-indigo-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'hover:bg-red-50', border: 'border-red-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-50', border: 'border-gray-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-50', border: 'border-pink-200' }
    };
    return colors[color] || colors['blue'];
  }
}
