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

  // Opciones de la barra lateral adaptadas para commerce
  sidebarOptions: SidebarOption[] = [
    { name: 'Dashboard', url: '/commerce/dashboard', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-3.25.5 3.25 2.25-2.25 3 3m-7.5 0h-4.5" />' },
    { name: 'Subcursales', url: '/commerce/subcursal', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 7.5h3m-3 4.5h3m-3 4.5h3m3-9h3m-3 4.5h3m-3 4.5h3" />' },
    { name: 'Descuentos', url: '/commerce/descuentos', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V5.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 5.25v13.5a2.25 2.25 0 002.25 2.25H13.5m0 0l3-3m0 0l3 3m-3-3V19.5" />' },
    { name: 'Liquidación', url: '/commerce/liquidacion', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />' },
    { name: 'Reportes', url: '/commerce/reportes', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 17h6l3 3v-3h2V5H4v12h5z M5 6h14v8H4V6h1z" />' },
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
    return option ? option.name : 'Comercio';
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
