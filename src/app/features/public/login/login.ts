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

  user: Partial<AppUser> | null = null;

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
    /*
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.alertService.showError('Formato de email inválido', 400);
      return;
    }
    */
    this.publicService.login({ username: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login response:', response);

        if (response.user.mfaActivated) {
          this.authService.saveUserData(response.user);
          this.openTwoFactorModal();
        }else{
          this.completeLogin(response.token, response.user, null);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401 && error.error?.twoFactorRequired) {
          // Si se requiere 2FA, abrir el modal
          this.openTwoFactorModal();
        } else {
          this.completeLogin('', null , error);
        }
      }
    });
  }

  completeLogin(token: string | null, usuario: AppUser | null, error: any) {
    if (error) {
      this.alertService.showError('Error en el inicio de sesión', 500);
      this.errorMessage = 'Error en el inicio de sesión';
      return;
    }
    if (!token) {
      this.alertService.showError('Token no proporcionado', 400);
      this.errorMessage = 'Token no proporcionado';
      return;
    }
    var user: AppUser | null = usuario;
    if (user == null || !user.id) {
      user = this.authService.getUserData();
    }

    // Simulate storing token and user, then redirect
    this.authService.login(token);

    // Mostrar mensaje de éxito
    this.alertService.showSuccess(`¡Bienvenido de vuelta, ${user?.name}!`);

    // Redirigir según el rol del usuario
    if (user?.role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  openTwoFactorModal(){
    this.showTwoFactorModal = true;
    this.cdr.detectChanges();
  }

  closeTwoFactorModal() {
    this.showTwoFactorModal = false;
  }

  onTwoFactorVerified(event: any) {
    const userData = this.authService.getUserData();
    const token = this.authService.getToken();
    const rol = userData?.role;
    const username = userData?.username;
    if (!username || !rol) {
      this.alertService.showError('Usuario no disponible. Intenta reiniciar sesión.', 400);
      return;
    }
    this.completeLogin( token, userData, null);
  }
}
