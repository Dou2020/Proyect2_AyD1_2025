import { ChangeDetectionStrategy, Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../utils/alert-modal/alert.service';
// import { Public as PublicService } from './../../../core/services/public';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('passwordHash');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}
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
    private alertService: AlertService
    //private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      appUser: this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        passwords: this.fb.group({
          passwordHash: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required]
        }, { validators: passwordMatchValidator })
      }),
      location: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        area: ['', Validators.required],
        notes: ['']
      })
    });
  }

  //getters
  get name() { return this.registrationForm.get('appUser.name'); }
  get lastname() { return this.registrationForm.get('appUser.lastname'); }
  get username() { return this.registrationForm.get('appUser.username'); }
  get email() { return this.registrationForm.get('appUser.email'); }
  get phoneNumber() { return this.registrationForm.get('appUser.phoneNumber'); }
  get password() { return this.registrationForm.get('appUser.passwords.passwordHash'); }
  get confirmPassword() { return this.registrationForm.get('appUser.passwords.confirmPassword'); }
  get locationName() { return this.registrationForm.get('location.name'); }
  get address() { return this.registrationForm.get('location.address'); }
  get area() { return this.registrationForm.get('location.area'); }




  getPayload(): any {
    const appUserGroup = this.registrationForm.get('appUser') as FormGroup;
    const passwordsGroup = appUserGroup.get('passwords') as FormGroup;
    const locationGroup = this.registrationForm.get('location') as FormGroup;

    return {
      appUser: {
        username: appUserGroup.get('username')?.value,
        passwordHash: passwordsGroup.get('passwordHash')?.value,
        phoneNumber: appUserGroup.get('phoneNumber')?.value,
        name: appUserGroup.get('name')?.value,
        lastname: appUserGroup.get('lastname')?.value,
        email: appUserGroup.get('email')?.value
      },
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

    // Simular proceso de registro
    const payload = this.getPayload();
    this.simulateRegistration(payload);
  }

  private simulateRegistration(payload: any): void {
    // Simular diferentes escenarios
    const email = payload.appUser.email;
    const username = payload.appUser.username;

    // Simular verificaciones
    if (email === 'existing@example.com') {
      this.alertService.showError('Este email ya está registrado', 409);
      return;
    }

    if (username === 'admin' || username === 'root') {
      this.alertService.showError('Nombre de usuario no disponible', 400);
      return;
    }

    // Simular error de servidor
    if (email.includes('error')) {
      this.alertService.showError('Error interno del servidor. Inténtalo más tarde', 500);
      return;
    }

    // Simular registro exitoso
    setTimeout(() => {
      this.alertService.showSuccess('¡Cuenta creada exitosamente! Revisa tu email para activar tu cuenta');
      this.registrationForm.reset();

      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1000);
  }

  private getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.name?.invalid && this.name?.touched) {
      errors.push('Nombre requerido');
    }

    if (this.lastname?.invalid && this.lastname?.touched) {
      errors.push('Apellido requerido');
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

    if (this.password?.invalid && this.password?.touched) {
      if (this.password?.errors?.['required']) {
        errors.push('Contraseña requerida');
      } else if (this.password?.errors?.['minlength']) {
        errors.push('Contraseña debe tener al menos 8 caracteres');
      }
    }

    if (this.confirmPassword?.invalid && this.confirmPassword?.touched) {
      if (this.confirmPassword?.errors?.['mismatch']) {
        errors.push('Las contraseñas no coinciden');
      }
    }

    if (this.locationName?.invalid && this.locationName?.touched) {
      errors.push('Nombre de ubicación requerido');
    }

    if (this.address?.invalid && this.address?.touched) {
      errors.push('Dirección requerida');
    }

    if (this.area?.invalid && this.area?.touched) {
      errors.push('Área requerida');
    }

    return errors;
  }
}
