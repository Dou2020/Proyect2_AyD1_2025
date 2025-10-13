import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth as AuthService } from '../../../core/auth/auth';
import { PublicService } from '../../../core/services/public.service';
import { AppUser } from '../../../core/models/public/appUser';
import { TwoFactorAuth } from '../two-factor-auth/two-factor-auth';
import { AlertService } from '../../utils/alert-modal/alert.service';

@Component({
  selector: 'app-login',
  standalone: true, // componente standalone
  imports: [CommonModule, FormsModule, RouterModule, TwoFactorAuth],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  user: any = {};

  showTwoFactorModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  login() {
    console.log('Login attempt with', this.email, this.password);
    this.errorMessage = '';

    // Validar campos vacíos
    if (!this.email || !this.password) {
      this.alertService.showWarning('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.alertService.showError('Formato de email inválido', 400);
      return;
    }

    // Simulate login process
    if (this.email === 'douglas@example.com' && this.password === 'pass1234') {
      // Simulate successful login
      const fakeToken = 'fake-jwt-token';
      const fakeUser: AppUser = {
        id: 1,
        email: this.email,
        name: 'Douglas',
        lastname: 'Admin',
        username: 'douglas',
        phoneNumber: '1234567890',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.completeLogin(fakeToken, fakeUser, null);
    } else if (this.email === 'user@example.com' && this.password === 'user123') {
      // Simulate user requiring 2FA
      this.alertService.showInfo('Se requiere verificación de dos factores');
      this.openTwoFactorModal();
    } else {
      // Simulate different error scenarios
      if (this.email === 'blocked@example.com') {
        this.alertService.showError('Cuenta bloqueada. Contacta al administrador', 403);
      } else if (this.email === 'notfound@example.com') {
        this.alertService.showError('Usuario no encontrado', 404);
      } else {
        this.alertService.showError('Credenciales inválidas', 401);
      }
      this.errorMessage = 'Error de autenticación';
    }
  }

  completeLogin(token: string, user: AppUser, error: any) {
    if (error) {
      this.alertService.showError('Error en el inicio de sesión', 500);
      this.errorMessage = 'Error en el inicio de sesión';
      return;
    }

    // Simulate storing token and user, then redirect
    this.authService.login(token);
    this.authService.saveUserData(user);

    // Mostrar mensaje de éxito
    this.alertService.showSuccess(`¡Bienvenido de vuelta, ${user.name}!`);

    // Redirigir según el rol del usuario
    if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  openTwoFactorModal(){
    this.showTwoFactorModal = true;
    this.cdr.detectChanges();
  }

  closeTwoFactorModal() {
    this.showTwoFactorModal = false;
  }

  onTwoFactorVerified(code: string) {
    console.log('2FA Code verified:', code);

    // Simular verificación del código 2FA
    if (code === '123456') {
      // Código correcto
      this.alertService.showSuccess('Verificación de dos factores completada');
      this.showTwoFactorModal = false;

      // Crear usuario simulado después de 2FA
      const fakeUser: AppUser = {
        id: 2,
        email: this.email,
        name: 'Usuario',
        lastname: 'Cliente',
        username: 'user',
        phoneNumber: '0987654321',
        role: 'client',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.completeLogin('fake-2fa-token', fakeUser, null);
    } else {
      // Código incorrecto
      this.alertService.showError('Código de verificación inválido', 400);
    }
  }
}
