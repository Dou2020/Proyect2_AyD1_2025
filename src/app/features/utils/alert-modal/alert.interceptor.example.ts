import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from './alert.service';

@Injectable()
export class AlertInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // Manejar respuestas exitosas
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          this.handleSuccessResponse(event, request);
        }
      }),
      // Manejar errores
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error, request);
        return throwError(() => error);
      })
    );
  }

  /**
   * Maneja respuestas exitosas y muestra alertas cuando es apropiado
   */
  private handleSuccessResponse(response: HttpResponse<any>, request: HttpRequest<unknown>): void {
    const method = request.method.toUpperCase();
    const url = request.url;

    // Solo mostrar alertas automáticas para ciertas operaciones
    if (this.shouldShowSuccessAlert(method, url)) {
      let message = this.getSuccessMessage(method, response);

      // Usar mensaje personalizado del servidor si existe
      if (response.body?.message) {
        message = response.body.message;
      }

      this.alertService.showSuccess(message);
    }
  }

  /**
   * Maneja errores HTTP y muestra alertas apropiadas
   */
  private handleErrorResponse(error: HttpErrorResponse, request: HttpRequest<unknown>): void {
    let message = 'Ha ocurrido un error';

    // Extraer mensaje del error
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.error?.error) {
      message = error.error.error;
    } else if (typeof error.error === 'string') {
      message = error.error;
    } else {
      message = this.getDefaultErrorMessage(error.status);
    }

    // No mostrar alertas para ciertos errores o URLs
    if (this.shouldShowErrorAlert(error, request)) {
      this.alertService.showError(message, error.status);
    }
  }

  /**
   * Determina si se debe mostrar una alerta de éxito
   */
  private shouldShowSuccessAlert(method: string, url: string): boolean {
    // Mostrar alertas para operaciones de modificación
    const showAlertMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    // No mostrar alertas para ciertas URLs (ej. endpoints de validación)
    const skipUrls = [
      '/auth/validate',
      '/health',
      '/ping'
    ];

    return showAlertMethods.includes(method) &&
           !skipUrls.some(skipUrl => url.includes(skipUrl));
  }

  /**
   * Determina si se debe mostrar una alerta de error
   */
  private shouldShowErrorAlert(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean {
    // No mostrar alertas para ciertos códigos de estado
    const skipStatusCodes = [401]; // 401 se maneja por el auth interceptor

    // No mostrar alertas para ciertas URLs
    const skipUrls = [
      '/auth/login', // Login maneja sus propias alertas
      '/auth/validate'
    ];

    return !skipStatusCodes.includes(error.status) &&
           !skipUrls.some(skipUrl => request.url.includes(skipUrl));
  }

  /**
   * Obtiene el mensaje de éxito basado en el método HTTP
   */
  private getSuccessMessage(method: string, response: HttpResponse<any>): string {
    switch (method) {
      case 'POST':
        return 'Registro creado exitosamente';
      case 'PUT':
      case 'PATCH':
        return 'Registro actualizado exitosamente';
      case 'DELETE':
        return 'Registro eliminado exitosamente';
      default:
        return 'Operación completada exitosamente';
    }
  }

  /**
   * Obtiene el mensaje de error por defecto basado en el código de estado
   */
  private getDefaultErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Solicitud inválida. Verifica los datos ingresados';
      case 401:
        return 'No autorizado. Inicia sesión para continuar';
      case 403:
        return 'Acceso prohibido. No tienes permisos para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return 'Conflicto. El recurso ya existe';
      case 422:
        return 'Datos de entrada inválidos';
      case 500:
        return 'Error interno del servidor';
      case 502:
        return 'Error de conexión. Verifica tu conexión a internet';
      case 503:
        return 'Servicio no disponible temporalmente';
      default:
        return 'Ha ocurrido un error inesperado';
    }
  }
}

/**
 * Para usar este interceptor, agrégalo a los providers en tu app.config.ts:
 *
 * import { HTTP_INTERCEPTORS } from '@angular/common/http';
 * import { AlertInterceptor } from './path/to/alert.interceptor';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... otros providers
 *     {
 *       provide: HTTP_INTERCEPTORS,
 *       useClass: AlertInterceptor,
 *       multi: true
 *     }
 *   ]
 * };
 */
