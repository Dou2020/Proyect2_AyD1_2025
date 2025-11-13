import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar as SubcursalSidebarComponent } from './sidebar';

@Component({
  selector: 'app-subcursal-layouts',
  imports: [CommonModule, RouterModule, SubcursalSidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
  `
})
export class SubcursalLayouts {

}
