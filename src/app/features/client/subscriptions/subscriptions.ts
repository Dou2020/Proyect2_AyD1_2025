import { Component, OnInit } from '@angular/core';
import { SubscriptionModel } from '../../../core/models/admin/subscription.model';
import { SubscriptionService } from '../../../core/services/admin/subscription.service';
import { VehicleService } from '../../../core/services/client/vehicle.service';
import { VehicleSubscriptionService } from '../../../core/services/client/vehicleSubscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscriptions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css'
})
export class Subscriptions implements OnInit {
  subscriptions: SubscriptionModel[] = [];

  showModal: boolean = false;
  selectedSubscriptionId: number | null = null;

  ownedVehicles: any[] = [];
  selectedVehicleId: number | null = null;
  selectedMonths: number | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private vehicleSubscriptionService: VehicleSubscriptionService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => this.subscriptions = data,
      error: () => alert('No se pudieron cargar las suscripciones')
    });
  }

  openBuyModal(subscriptionId: number) {
    this.selectedSubscriptionId = subscriptionId;

    this.vehicleService.getOwnedVehicles().subscribe({
      next: (vehicles) => {
        this.ownedVehicles = vehicles;
        this.showModal = true;
      },
      error: () => alert('No se pudieron obtener los vehículos')
    });
  }

  confirmPurchase() {
    if (!this.selectedVehicleId || !this.selectedMonths || this.selectedMonths < 1) {
      alert('Debes seleccionar un vehículo');
      return;
    }

    const payload = {
      vehicleId: this.selectedVehicleId,
      subscriptionId: this.selectedSubscriptionId,
      totalMonths: this.selectedMonths,
      notes: "Compra realizada desde UI"
    };

    this.vehicleSubscriptionService.buySubscription(payload).subscribe({
      next: () => {
        alert('Suscripción comprada exitosamente');
        this.showModal = false;
        this.selectedVehicleId = null;
        this.selectedMonths = null;
      },
      error: (err) => {
        const backendMessage =
          err?.error?.message ||
          err?.error?.error ||
          err?.message ||
          'No se pudo comprar la suscripción';

        alert(backendMessage);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedVehicleId = null;
  }
}
