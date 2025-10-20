# Componente de Alertas Reutilizable

Este componente permite mostrar alertas personalizadas para diferentes tipos de respuestas HTTP (200, 400, 500, etc.) de manera consistente en toda la aplicación.

## Características

- ✅ Soporte para múltiples tipos de alerta (éxito, error, advertencia, información)
- ✅ Manejo automático de códigos de estado HTTP
- ✅ Auto-cierre configurable
- ✅ Animaciones suaves
- ✅ Diseño responsivo
- ✅ Soporte para tema oscuro
- ✅ Componente standalone reutilizable

## Uso Básico

### 1. Agregar el componente a tu template principal

```html
<!-- En tu app.component.html o layout principal -->
<app-alert-modal></app-alert-modal>

<!-- El resto del contenido de tu aplicación -->
<router-outlet></router-outlet>
```

### 2. Inyectar el servicio en tu componente

```typescript
import { Component } from '@angular/core';
import { AlertService } from './features/utils/alert-modal/alert.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  
  constructor(private alertService: AlertService) {}

  // Ejemplo de uso con diferentes tipos de alerta
  showSuccessAlert() {
    this.alertService.showSuccess('Operación completada exitosamente');
  }

  showErrorAlert() {
    this.alertService.showError('Error al procesar la solicitud', 400);
  }

  // Manejo automático de respuestas HTTP
  handleApiResponse(response: any) {
    this.alertService.handleHttpResponse(response, 'Usuario creado correctamente');
  }
}
```

## Métodos Disponibles

### AlertService

#### `showSuccess(message, title?, autoClose?, duration?)`
Muestra una alerta de éxito (típicamente para respuestas 200).

```typescript
this.alertService.showSuccess('Usuario registrado correctamente');
this.alertService.showSuccess('Datos guardados', 'Éxito', true, 3000);
```

#### `showError(message, statusCode?, title?, autoClose?, duration?)`
Muestra una alerta de error (para códigos 400, 500, etc.).

```typescript
this.alertService.showError('Email ya está en uso', 400);
this.alertService.showError('Error interno del servidor', 500, 'Error Crítico');
```

#### `showWarning(message, title?, autoClose?, duration?)`
Muestra una alerta de advertencia.

```typescript
this.alertService.showWarning('Los cambios no se han guardado');
```

#### `showInfo(message, title?, autoClose?, duration?)`
Muestra una alerta informativa.

```typescript
this.alertService.showInfo('Procesando solicitud...');
```

#### `handleHttpResponse(response, successMessage?)`
Maneja automáticamente respuestas HTTP y muestra la alerta apropiada.

```typescript
// En tu servicio HTTP
this.http.post('/api/users', userData).subscribe({
  next: (response) => {
    this.alertService.handleHttpResponse(response, 'Usuario creado exitosamente');
  },
  error: (error) => {
    this.alertService.handleHttpResponse(error);
  }
});
```

#### `removeAlert(id)`
Remueve una alerta específica.

#### `clearAll()`
Limpia todas las alertas activas.

## Ejemplos de Uso Común

### 1. Manejo de Autenticación

```typescript
// login.component.ts
login() {
  this.authService.login(this.credentials).subscribe({
    next: (response) => {
      if (response.status === 200) {
        this.alertService.showSuccess('Bienvenido de vuelta!');
        this.router.navigate(['/dashboard']);
      }
    },
    error: (error) => {
      if (error.status === 400) {
        this.alertService.showError('Credenciales inválidas', 400);
      } else if (error.status === 500) {
        this.alertService.showError('Error del servidor. Inténtalo más tarde', 500);
      }
    }
  });
}
```

### 2. Manejo de Formularios

```typescript
// register.component.ts
onSubmit() {
  if (this.registerForm.valid) {
    this.userService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.alertService.showSuccess('Cuenta creada exitosamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al crear la cuenta';
        this.alertService.showError(message, error.status);
      }
    });
  } else {
    this.alertService.showWarning('Por favor completa todos los campos requeridos');
  }
}
```

### 3. Operaciones CRUD

```typescript
// users.component.ts
deleteUser(userId: string) {
  this.userService.delete(userId).subscribe({
    next: () => {
      this.alertService.showSuccess('Usuario eliminado correctamente');
      this.loadUsers(); // Recargar lista
    },
    error: (error) => {
      if (error.status === 404) {
        this.alertService.showError('Usuario no encontrado', 404);
      } else {
        this.alertService.showError('Error al eliminar usuario', error.status);
      }
    }
  });
}
```

## Personalización

### Modificar Duración de Auto-cierre

```typescript
// Alerta que se cierra automáticamente en 10 segundos
this.alertService.showError('Error crítico', 500, 'Error', true, 10000);

// Alerta que NO se cierra automáticamente
this.alertService.showError('Atención requerida', 400, 'Error', false);
```

### Códigos de Estado Soportados

El servicio incluye títulos predefinidos para los siguientes códigos:

- **200-299**: Éxito
- **400**: Error de Solicitud
- **401**: No Autorizado  
- **403**: Acceso Prohibido
- **404**: No Encontrado
- **422**: Datos Inválidos
- **500**: Error del Servidor
- **502**: Error de Gateway
- **503**: Servicio No Disponible

## Integración con Interceptores HTTP

Para manejo automático de errores en toda la aplicación:

```typescript
// http-error.interceptor.ts
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(private alertService: AlertService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores globalmente
        if (error.status >= 500) {
          this.alertService.showError('Error del servidor', error.status);
        } else if (error.status === 401) {
          this.alertService.showError('Sesión expirada', 401);
          // Redirigir al login
        }
        return throwError(() => error);
      })
    );
  }
}
```

## Notas Importantes

- El componente debe incluirse solo una vez en tu aplicación (preferiblemente en el layout principal)
- Las alertas se posicionan en la esquina superior derecha por defecto
- Es responsive y se adapta a dispositivos móviles
- Soporta tema oscuro automáticamente basado en las preferencias del sistema
- Utiliza animaciones CSS para una mejor experiencia de usuario
