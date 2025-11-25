import { ChangeDetectionStrategy, Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../utils/alert-modal/alert.service';
import { PublicService } from './../../../core/services/public.service';
import { RegisterModel } from './../../../core/models/register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register implements OnInit {

  registrationForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      mfaActivated: [false] // Default to false
    });
  }

  //getters
  get name() { return this.registrationForm.get('name'); }
  get username() { return this.registrationForm.get('username'); }
  get email() { return this.registrationForm.get('email'); }
  get phoneNumber() { return this.registrationForm.get('phoneNumber'); }
  get mfaActivated() { return this.registrationForm.get('mfaActivated'); }




  getPayload(): RegisterModel {
    return {
      username: this.registrationForm.get('username')?.value,
      name: this.registrationForm.get('name')?.value,
      email: this.registrationForm.get('email')?.value,
      phoneNumber: this.registrationForm.get('phoneNumber')?.value,
      role: 'CLIENT', // Always CLIENT for client registration
      mfaActivated: this.registrationForm.get('mfaActivated')?.value || false
    };
  }



    register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      // Mostrar errores específicos
      const errors = this.getFormErrors();
      if (errors.length > 0) {
        this.alertService.showError(`Errores en el formulario: ${errors.join(', ')}`, 400);
      } else {
        this.alertService.showWarning('Por favor completa todos los campos requeridos');
      }
      return;
    }

    // Crear payload con el modelo correcto
    const payload = this.getPayload();

    // Llamar al servicio de registro
    this.publicService.registerUser(payload).subscribe({
      next: (response) => {
        this.alertService.showSuccess('¡Cuenta creada exitosamente! Revisa tu email para activar tu cuenta');
        this.registrationForm.reset();

        // Redirigir al login después de un breve retraso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error en el registro:', error);

        // Manejar diferentes tipos de errores
        if (error.status === 409) {
          this.alertService.showError('Este email o usuario ya está registrado', 409);
        } else if (error.status === 400) {
          this.alertService.showError('Datos inválidos. Por favor verifica la información ingresada', 400);
        } else if (error.status === 500) {
          this.alertService.showError('Error interno del servidor. Inténtalo más tarde', 500);
        } else {
          this.alertService.showError('Error al crear la cuenta. Inténtalo más tarde', error.status || 0);
        }
      }
    });
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.name?.invalid && this.name?.touched) {
      errors.push('Nombre requerido');
    }

    if (this.username?.invalid && this.username?.touched) {
      if (this.username?.errors?.['required']) {
        errors.push('Usuario requerido');
      } else if (this.username?.errors?.['minlength']) {
        errors.push('Usuario debe tener al menos 4 caracteres');
      }
    }

    if (this.email?.invalid && this.email?.touched) {
      if (this.email?.errors?.['required']) {
        errors.push('Email requerido');
      } else if (this.email?.errors?.['email']) {
        errors.push('Email inválido');
      }
    }

    if (this.phoneNumber?.invalid && this.phoneNumber?.touched) {
      errors.push('Teléfono requerido');
    }

    return errors;
  }
}
