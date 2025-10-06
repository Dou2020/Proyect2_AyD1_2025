import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar as ClientSidebarComponent } from './sidebar';


@Component({
  selector: 'app-client-layouts',
  imports: [CommonModule, RouterModule, ClientSidebarComponent],
  template: `
    <div class="flex h-screen bg-slate-100"> <app-sidebar></app-sidebar>

      <div class="flex-1 p-6 lg:p-8 overflow-y-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class ClientLayouts {

}
