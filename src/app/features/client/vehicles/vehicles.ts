import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../core/services/client/vehicle.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  imports: [RouterModule, CommonModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit{
  vehicles: any[] = [];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getOwnedVehicles().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  viewSubscription(id: number) {
    console.log('Ver suscripción de:', id);
  }

  viewBill(id: number) {
    console.log('Ver facturas de:', id);
  }


}
