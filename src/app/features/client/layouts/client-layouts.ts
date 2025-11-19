import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar as ClientSidebarComponent } from './sidebar';

@Component({
  selector: 'app-client-layouts',
  imports: [CommonModule, RouterModule, ClientSidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
  `
})
export class ClientLayouts {

}
