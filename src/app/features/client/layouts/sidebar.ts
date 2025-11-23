import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth as AuthService } from '../../../core/auth/auth';
import { AppUser } from './../../../core/models/public/appUser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface SidebarOption {
  name: string;
  url: string;
  icon: string; 
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  showMenu = signal(false);
  sidebarCollapsed = signal(false);

  private sanitizer = inject(DomSanitizer);

  sidebarOptions: SidebarOption[] = [
    { 
      name: 'Dashboard', 
      url: '/client/dashboard', 
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-3.25.5 3.25 2.25-2.25 3 3m-7.5 0h-4.5" />' 
    },
    { 
      name: 'Mis vehiculos', 
      url: '/client/vehicles', 
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.5 13.5l1.2-3.6A2 2 0 016.6 8h10.8a2 2 0 011.9 1.4l1.2 3.6M5 13.5h14m-11 3.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm10.5 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />' 
    },
    { 
      name: 'Suscripciones', 
      url: '/client/subscriptions', 
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' 
    },
    { 
      name: 'Transferencias', 
      url: '/client/transfers', 
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v4.5c0 .621.504 1.125 1.125 1.125H17.5m-5.5-5.625L17.5 8.25M6 6.75A2.25 2.25 0 018.25 4.5h3.75l5.25 5.25v9A2.25 2.25 0 0115 21H8.25A2.25 2.25 0 016 18.75v-12z" />' 
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get user(): AppUser {
    return this.authService.getUserData() as AppUser;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  getCurrentPageTitle(): string {
    const currentUrl = this.router.url;
    const option = this.sidebarOptions.find(opt => opt.url === currentUrl);
    return option ? option.name : 'Cliente';
  }

  sanitizeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  toggleMenu(): void {
    this.showMenu.update((value: boolean) => !value);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((value: boolean) => !value);
  }
}
