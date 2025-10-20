import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {Sidebar as SidebarComponent } from './sidebar';

@Component({
  selector: 'app-admin-layouts',
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
  `
})
export class AdminLayouts {

}
