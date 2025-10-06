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
  }

  recoverPassword() {
    const credentials = {
      username: this.form.username,
      code: this.form.code,
      password: this.form.newPassword
    };
    this.publicService.recoveryPassword(credentials).subscribe({
      next: (response) => {
        alert("Exito al cambiar la contraseña, ahora puedes ingresar");
      },
      error: (err) => {
        alert("Ocurrio un error al intentar recuperar la contraseña, intentalo mas tarde");
      }
    });
  }


}
