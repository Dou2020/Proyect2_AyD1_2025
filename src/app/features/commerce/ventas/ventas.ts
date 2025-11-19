import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule],
  template: `
    <div class="min-h-full bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Gestión de Ventas</h2>
          <p class="text-gray-600">Aquí podrás gestionar todas las ventas y transacciones del comercio.</p>
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-blue-800">🚧 Módulo en construcción - Próximamente disponible</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Ventas {

}
