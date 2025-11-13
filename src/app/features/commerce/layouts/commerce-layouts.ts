import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar as CommerceSidebarComponent } from './sidebar';

@Component({
  selector: 'app-commerce-layouts',
  imports: [CommonModule, RouterModule, CommerceSidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
  `
})
export class CommerceLayouts {

}
