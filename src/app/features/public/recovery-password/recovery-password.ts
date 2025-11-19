import { Component } from '@angular/core';
import { PublicService } from '../../../core/services/public.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-password',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './recovery-password.html',
  styleUrl: './recovery-password.scss'
})
export class RecoveryPassword {

  form = {
    username: '',
    email: '',
    code: '',
    newPassword: ''
  };

  constructor(
    private publicService: PublicService,
  ) { }

  requestCode() {
    if (!this.form.username) {
      alert("Por favor ingresa tu nombre de usuario");
      return;
    }

    this.publicService.resendVerificationCode(this.form.username).subscribe({
      next: (response) => {
        alert("Código de recuperación enviado exitosamente. Revisa tu correo electrónico.");
      },
      error: (err) => {
        alert("Error al solicitar el código. Verifica que el usuario sea correcto.");
      }
    });
  }

  recoverPassword() {
    // Validar que todos los campos requeridos estén completos
    if (!this.form.username || !this.form.code || !this.form.newPassword) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const credentials = {
      username: this.form.username,
      code: this.form.code,
      password: this.form.newPassword
    };

    this.publicService.recoveryPassword(credentials).subscribe({
      next: (response) => {
        alert("Éxito al cambiar la contraseña, ahora puedes ingresar");
        // Limpiar el formulario después del éxito
        this.form = {
          username: '',
          email: '',
          code: '',
          newPassword: ''
        };
      },
      error: (err) => {
        alert("Ocurrió un error al intentar recuperar la contraseña, inténtalo más tarde");
        console.error('Error en recovery password:', err);
      }
    });
  }


}
