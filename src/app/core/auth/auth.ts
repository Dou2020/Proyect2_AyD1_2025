import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUser } from '../models/public/appUser';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private TOKEN_KEY = 'auth_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Guardar token en localStorage (cuando hagas login)
  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Obtener token actual
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // Eliminar token (logout)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('user_data'); // También eliminar datos del usuario
    }
  }

  // Saber si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtener rol del usuario desde el token (simulado aquí)
  getUserRole(): 'admin' | 'client' | null {
    const token = this.getToken();
    if (token === 'fake-jwt-token-admin') {
      return 'admin';
    } else if (token === 'fake-jwt-token-client') {
      return 'client';
    }
    return null;
  }

  // Guardar datos del usuario en localStorage
  saveUserData(userData: AppUser): void {
    if (isPlatformBrowser(this.platformId)) {
      //console.log('Saving user data:', userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  }

  // Obtener datos del usuario desde localStorage
  getUserData(): AppUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('user_data');
      const userData = data ? JSON.parse(data) : null;
      //console.log('Retrieved user data:', userData);
      return userData;
    }
    return null;
  }

}
