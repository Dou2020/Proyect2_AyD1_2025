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
    { name: 'Dashboard', url: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-3.25.5 3.25 2.25-2.25 3 3m-7.5 0h-4.5" />' },
    { name: 'Productos', url: '/commerce/productos', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.75 7.5h16.5-1.5-.75 0h.75m-16.5 0l1.5-1.5h13.5l1.5 1.5" />' },
    { name: 'Ventas', url: '/commerce/ventas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H4.5m2.25 0v3m0 0v.375c0 .621-.504 1.125-1.125 1.125H4.5m2.25-4.125V3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.5m-9.75 0V6h12V4.5m-12 0h12" />' },
    { name: 'Inventario', url: '/commerce/inventario', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m8.25 4.5V16.5a1.5 1.5 0 011.5-1.5h4.5a1.5 1.5 0 011.5 1.5v1.875a1.125 1.125 0 01-1.125 1.125H16.5a1.5 1.5 0 01-1.5-1.5v-1.5m0 0V14.25M16.5 16.5h2.25" />' },
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
