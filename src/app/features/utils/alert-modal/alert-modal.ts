import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.css'
})
export class AlertModal implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Cierra una alerta específica
   */
  closeAlert(id: string) {
    this.alertService.removeAlert(id);
  }

  /**
   * Obtiene el icono apropiado para cada tipo de alerta
   */
  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }

  /**
   * Obtiene las clases CSS apropiadas para cada tipo de alerta
   */
  getAlertClasses(type: string): string {
    return `alert alert-${type}`;
  }

  /**
   * Función de seguimiento para ngFor para mejorar el rendimiento
   */
  trackByFn(index: number, item: Alert): string {
    return item.id;
  }
}
