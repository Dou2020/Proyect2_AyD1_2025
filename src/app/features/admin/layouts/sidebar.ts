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

  // Opciones de la barra lateral.
  sidebarOptions: SidebarOption[] = [
    { name: 'Dashboard', url: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-3.25.5 3.25 2.25-2.25 3 3m-7.5 0h-4.5" />' },
    { name: 'Usuarios', url: '/admin/usuarios', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663v-.005A9.345 9.345 0 0112 12c-3.057 0-5.764.98-7.922 2.625" />' },
    { name: 'Configuración', url: '/admin/configuracion', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.197-.22 1.752 0 .549.219 1.016.684 1.11 1.226l.793.793A.75.75 0 019.75 4.5h4.5a.75.75 0 010 1.5H12a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0V7.5h2.25a2.25 2.25 0 000-4.5H9.75a2.25 2.25 0 00-2.25 2.25v1.07l.594-.565z" />' },
    { name: 'Reportes', url: '/admin/reportes', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 17h6l3 3v-3h2V5H4v12h5z M5 6h14v8H4V6h1z" />' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get user(): AppUser {
    return this.authService.getUserData() as AppUser;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
  users() {
    this.router.navigate(['/admin/users']);
  }

  // Método para obtener el título de la página actual
  getCurrentPageTitle(): string {
    const currentUrl = this.router.url;
    const option = this.sidebarOptions.find(opt => opt.url === currentUrl);
    return option ? option.name : 'Administrador';
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
