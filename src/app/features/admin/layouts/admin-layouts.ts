import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {Sidebar as SidebarComponent } from './sidebar';

@Component({
  selector: 'app-admin-layouts',
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="h-screen w-screen bg-slate-200 flex">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminLayouts {

}
