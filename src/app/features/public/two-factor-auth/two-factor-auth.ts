import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth as AuthService } from '../../../core/auth/auth';
import { PublicService } from '../../../core/services/public.service';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor-auth.html',
  styleUrl: './two-factor-auth.scss'
})
export class TwoFactorAuth {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<string>();

  code: string[] = ['', '', '', '', '', ''];
  twoFactorError: string | null = null;

  constructor(private authService: AuthService, private router: Router, private publicService: PublicService) {}

  closeTwoFactorModal() {
    this.isVisible = false;
    this.code = ['', '', '', '', '', ''];
    this.twoFactorError = null;
    this.close.emit();
  }

  verifyTwoFactorCode() {
    const fullCode = this.code.join('');
    if (fullCode.length === 6) {

      console.log('Verifying 2FA code:', fullCode);

      const userData = this.authService.getUserData();
      const username = userData?.username;
      if (!username) {
        this.twoFactorError = 'Usuario no disponible. Intenta reiniciar sesión.';
        return;
      }

      this.publicService.twoFactorAuth({ username, code: fullCode }).subscribe({
        next: (response) => {
          this.authService.login(response.token);
          this.verified.emit(fullCode);
          this.closeTwoFactorModal();
        },
        error: (err) => {
          this.twoFactorError = 'Código incorrecto. Intenta nuevamente.';
          // Limpiar campos en caso de error
          this.code = ['', '', '', '', '', ''];
          this.clearAllInputs();
        }
      });
    }
  }

  // Funciones para la transición automática de campos
  onCodeInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Solo permitir números
    if (!/^\d*$/.test(value)) {
      input.value = '';
      this.code[index] = '';
      // Añadir clase de error temporalmente
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 300);
      return;
    }

    // Actualizar el array de código
    this.code[index] = value;

    // Añadir efectos visuales
    if (value) {
      input.classList.add('filled', 'success');
      setTimeout(() => input.classList.remove('success'), 200);
    } else {
      input.classList.remove('filled');
    }

    // Si se ingresó un dígito, mover al siguiente campo
    if (value && index < 5) {
      const nextInput = input.parentElement.children[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }

    // Auto-submit cuando se completen todos los campos
    if (value && index === 5) {
      const fullCode = this.code.join('');
      if (fullCode.length === 6) {
        setTimeout(() => {
          this.verifyTwoFactorCode();
        }, 100);
      }
    }

    // Limpiar error si existe
    if (this.twoFactorError) {
      this.twoFactorError = null;
    }
  }

  onCodeKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Manejar backspace
    if (event.key === 'Backspace') {
      event.preventDefault();

      // Si el campo actual tiene contenido, borrarlo
      if (input.value) {
        input.value = '';
        this.code[index] = '';
        input.classList.remove('filled');
      }
      // Si está vacío, mover al anterior y borrarlo
      else if (index > 0) {
        const prevInput = input.parentElement?.children[index - 1] as HTMLInputElement;
        if (prevInput) {
          prevInput.value = '';
          this.code[index - 1] = '';
          prevInput.classList.remove('filled');
          prevInput.focus();
          prevInput.select();
        }
      }
    }
    // Manejar Delete
    else if (event.key === 'Delete') {
      event.preventDefault();
      input.value = '';
      this.code[index] = '';
      input.classList.remove('filled');
    }
    // Manejar flecha izquierda
    else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = input.parentElement?.children[index - 1] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
    // Manejar flecha derecha
    else if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      const nextInput = input.parentElement?.children[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
    // Manejar Tab (permitir navegación normal)
    else if (event.key === 'Tab') {
      // Permitir comportamiento normal de Tab
      return;
    }
    // Manejar Enter
    else if (event.key === 'Enter') {
      event.preventDefault();
      this.verifyTwoFactorCode();
    }
    // Prevenir caracteres no numéricos
    else if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onCodePaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const inputContainer = (event.target as HTMLInputElement).parentElement;

      // Añadir efecto visual de pegado
      if (inputContainer) {
        const allInputs = Array.from(inputContainer.children) as HTMLInputElement[];
        allInputs.forEach(input => input.classList.add('pasting'));

        setTimeout(() => {
          allInputs.forEach(input => input.classList.remove('pasting'));
        }, 300);
      }

      // Llenar los campos con los dígitos pegados
      for (let i = 0; i < 6; i++) {
        this.code[i] = digits[i] || '';
        const targetInput = inputContainer?.children[i] as HTMLInputElement;
        if (targetInput) {
          targetInput.value = this.code[i];

          // Añadir clase filled si hay contenido
          if (this.code[i]) {
            targetInput.classList.add('filled');
          } else {
            targetInput.classList.remove('filled');
          }
        }
      }

      // Enfocar el siguiente campo vacío o el último si están todos llenos
      let focusIndex = digits.length < 6 ? digits.length : 5;
      const targetInput = inputContainer?.children[focusIndex] as HTMLInputElement;
      if (targetInput) {
        targetInput.focus();
        targetInput.select();
      }

      // Auto-submit si se pegó un código completo
      if (digits.length === 6) {
        setTimeout(() => {
          this.verifyTwoFactorCode();
        }, 300);
      }

      // Limpiar error si existe
      if (this.twoFactorError) {
        this.twoFactorError = null;
      }
    }
  }

  private clearAllInputs() {
    // Limpiar todos los inputs visualmente
    setTimeout(() => {
      const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
      inputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
      });
    }, 100);
  }
}
