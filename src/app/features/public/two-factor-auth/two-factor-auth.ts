import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {Auth as AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-two-factor-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor-auth.html',
  styleUrl: './two-factor-auth.scss'
})
export class TwoFactorAuth {
  code = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  verifyCode() {
    if (this.code === '123456') {
      this.router.navigate(['/client']); // acceso concedido
    } else {
      this.errorMessage = 'Código incorrecto';
    }
  }
}
