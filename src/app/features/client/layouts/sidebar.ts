import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth as AuthService } from '../../../core/auth/auth';
import { AppUser } from '../../../core/models/public/appUser';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
})

export class Sidebar {
  showMenu = false;
  sidebarCollapsed = false;
  sidebarOptions = [
    { name: 'Dashboard', url: '/client/dashboard' },
    { name: 'Perfil', url: '/client/profile' },
    { name: 'Historial', url: '/client/history' },
    { name: 'Pagos', url: '/client/payments' },
    { name: 'Configuración', url: '/client/settings' }
  ];

  constructor(private authService: AuthService) { }

  get user(): AppUser {
    return this.authService.getUserData() as AppUser;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  getSidebarOptions() {
    return this.sidebarOptions;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
