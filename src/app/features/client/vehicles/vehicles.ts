import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../core/services/client/vehicle.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleSubscriptionService } from '../../../core/services/client/vehicleSubscription.service';

@Component({
  selector: 'app-vehicles',
  imports: [RouterModule, CommonModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css'
})
export class Vehicles implements OnInit {
  vehicles: any[] = [];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private vehicleSubscriptionService: VehicleSubscriptionService
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getOwnedVehicles().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  viewBill(id: number) {
    this.router.navigate(['client/vehicles/facturation', id]);
  }

  //suscription
  showModal = false;
  subscription: any = null;

  viewSubscription(id: number) {
    this.subscription = null;
    this.vehicleSubscriptionService.findCurrentSubscription(id).subscribe({
      next: (data) => {
        this.subscription = data;
        if (this.subscription) {
          this.showModal = true;
        } else {
          alert("El vehículo no tiene una suscripción asociada");
        }
      },
      error: (err) => alert(err.mss ?? 'Ocurrio un error')
    })
  }


}
