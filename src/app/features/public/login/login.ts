import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth as AuthService } from '../../../core/auth/auth';
import { PublicService } from '../../../core/services/public.service';
import { AppUser } from '../../../core/models/public/appUser';

@Component({
  selector: 'app-login',
  standalone: true, // componente standalone
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  user: any = {};

  showTwoFactorModal = false;
  code: string[] = ['', '', '', '', '', ''];
  twoFactorError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private publicService: PublicService,
    private cdr: ChangeDetectorRef
  ) { }

  login() {
    console.log('Login attempt with', this.email, this.password);
    this.errorMessage = '';
    // Simulate login process
    if (this.email === 'douglas' && this.password === 'pass1234') {
      // Simulate successful login
      const fakeToken = 'fake-jwt-token';
      const fakeUser: AppUser = {
        id: 1,
        email: this.email,
        name: 'Test User',
        lastname: 'Demo',
        username: 'testuser',
        phoneNumber: '1234567890',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.completeLogin(fakeToken, fakeUser, null);
    } else {
      // Simulate login error
      this.errorMessage = 'Credenciales inválidas';
    }
  }

  completeLogin(token: string, user: AppUser, error: any) {
    if (error) {
      this.errorMessage = 'Error en el inicio de sesión';
      return;
    }
    // Simulate storing token and user, then redirect
    this.authService.login(token);
    this.authService.saveUserData(user);
    this.router.navigate(['/admin/dashboard']);
  }

  openTwoFactorModal(){
    this.showTwoFactorModal = true;
    this.cdr.detectChanges();
  }

  //mfa modal
  closeTwoFactorModal() {
  }

  verifyTwoFactorCode() {
  }

}
