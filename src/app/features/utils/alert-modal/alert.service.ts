import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  statusCode?: number;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertSubject.asObservable();

  constructor() { }

  /**
   * Muestra una alerta de éxito (status code 200)
   */
  showSuccess(message: string, title?: string, autoClose: boolean = true, duration: number = 5000) {
    this.showAlert('success', message, title, 200, autoClose, duration);
  }

  /**
   * Muestra una alerta de error para códigos 400 y 500
   */
  showError(message: string, statusCode?: number, title?: string, autoClose: boolean = true, duration: number = 8000) {
    const errorTitle = title || this.getErrorTitle(statusCode);
    this.showAlert('error', message, errorTitle, statusCode, autoClose, duration);
  }

  /**
   * Muestra una alerta de advertencia
   */
  showWarning(message: string, title?: string, autoClose: boolean = true, duration: number = 6000) {
    this.showAlert('warning', message, title, undefined, autoClose, duration);
  }

  /**
   * Muestra una alerta de información
   */
  showInfo(message: string, title?: string, autoClose: boolean = true, duration: number = 5000) {
    this.showAlert('info', message, title, undefined, autoClose, duration);
  }

  /**
   * Método genérico para mostrar alertas
   */
  private showAlert(type: Alert['type'], message: string, title?: string, statusCode?: number, autoClose: boolean = true, duration: number = 5000) {
    const alert: Alert = {
      id: this.generateId(),
      type,
      title,
      message,
      statusCode,
      autoClose,
      duration
    };

    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, alert]);

    if (autoClose) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, duration);
    }
  }

  /**
   * Remueve una alerta específica
   */
  removeAlert(id: string) {
    const currentAlerts = this.alertSubject.value;
    const filteredAlerts = currentAlerts.filter(alert => alert.id !== id);
    this.alertSubject.next(filteredAlerts);
  }

  /**
   * Limpia todas las alertas
   */
  clearAll() {
    this.alertSubject.next([]);
  }

  /**
   * Obtiene el título apropiado basado en el código de estado
   */
  private getErrorTitle(statusCode?: number): string {
    switch (statusCode) {
      case 400:
        return 'Error de Solicitud';
      case 401:
        return 'No Autorizado';
      case 403:
        return 'Acceso Prohibido';
      case 404:
        return 'No Encontrado';
      case 422:
        return 'Datos Inválidos';
      case 500:
        return 'Error del Servidor';
      case 502:
        return 'Error de Gateway';
      case 503:
        return 'Servicio No Disponible';
      default:
        return 'Error';
    }
  }

  /**
   * Genera un ID único para la alerta
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Método de conveniencia para manejar respuestas HTTP
   */
  handleHttpResponse(response: any, successMessage?: string) {
    const statusCode = response.status || response.statusCode;

    if (statusCode >= 200 && statusCode < 300) {
      const message = successMessage || response.message || 'Operación exitosa';
      this.showSuccess(message);
    } else if (statusCode >= 400) {
      const message = response.message || response.error?.message || 'Ha ocurrido un error';
      this.showError(message, statusCode);
    }
  }
}
