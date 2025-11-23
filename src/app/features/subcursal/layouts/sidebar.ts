import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth as AuthService } from '../../../core/auth/auth';
import { AppUser } from './../../../core/models/public/appUser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Definimos una interfaz para las opciones del menú para tener un tipado más estricto.
interface SidebarOption {
  name: string;
  url: string;
  icon: string; // El ícono será una cadena con el contenido del SVG.
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  showMenu = signal(false);
  sidebarCollapsed = signal(false);

  // Inyectamos DomSanitizer para poder renderizar HTML de forma segura (para los íconos).
  private sanitizer = inject(DomSanitizer);

  // Opciones de la barra lateral - adaptadas para sucursal
  sidebarOptions: SidebarOption[] = [
    {
      name: 'Dashboard',
      url: '/subcursal/dashboard',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-3.25.5 3.25 2.25-2.25 3 3m-7.5 0h-4.5" />'
    },
    {
      name: 'Tickets',
      url: '/subcursal/tickets',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
    },
    {
      name: 'Incidencias',
      url: '/subcursal/incidencias',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />'
    },
    {
      name: 'Reportes',
      url: '/subcursal/reportes',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />'
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get user(): AppUser {
    return this.authService.getUserData() as AppUser;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  // Método para obtener el título de la página actual
  getCurrentPageTitle(): string {
    const currentUrl = this.router.url;
    const option = this.sidebarOptions.find(opt => opt.url === currentUrl);
    return option ? option.name : 'Sucursal';
  }

  // Método para sanitizar el HTML de los íconos y evitar riesgos de seguridad.
  sanitizeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  // Métodos para manejar los eventos de la UI.
  toggleMenu(): void {
    this.showMenu.update((value: boolean) => !value);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((value: boolean) => !value);
  }
}
