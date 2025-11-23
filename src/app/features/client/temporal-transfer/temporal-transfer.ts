import { Component, inject, OnInit } from '@angular/core';
import { TemporalTransferService } from '../../../core/services/backoffice/temporalTransfer.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/client/vehicle.service';
import { Auth as AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-temporal-transfer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './temporal-transfer.html',
  styleUrl: './temporal-transfer.css'
})
export class TemporalTransfer implements OnInit {

  constructor(
    private temporalTransferService: TemporalTransferService,
    private vehicleService: VehicleService
  ) {}

  private authService = inject(AuthService);
  transfers: any[] = [];
  ownedVehicles: any[] = [];

  ngOnInit(): void {
    let userId = this.authService.getUserData()?.id;
    console.log("User Id: " + userId);
    this.temporalTransferService.findByUser(userId,userId).subscribe({
      next: (data) => {
        this.transfers = data
      },  
      error: (err) => alert("No se pudieron cargar las transferencia temporales")
    });
    this.vehicleService.getOwnedVehicles().subscribe({
      next: (data) => this.ownedVehicles = data,
      error: (err) => alert("No se pudieron cargar los vehiculos")
    });
  }

  isFormOpen = false;

  formData = {
    reason: null,
    justification: '',
    validFrom: '',
    validUntil: '',
    originalVehicleId: null,
    secondVehicleId: null,
  };

  file: File | null = null;

  reasons = [
    { value: "THEFT", label: "Robo" },
    { value: "DAMAGE", label: "Daños" },
    { value: "VEHICLE_SOLD", label: "Vehículo vendido" },
    { value: "LEGAL_RESTRICTION", label: "Restricción legal" },
    { value: "OTHER", label: "Otro" }
  ];


  handleFile(event: any) {
    this.file = event.target.files[0] || null;
  }

  submitTemporalTransfer() {
    const form = new FormData();
    form.append("data", new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));

    if(!this.file){
      alert("Debes mandar una advertencia");
      return;
    } else {
      form.append("file", this.file);
    }

    this.temporalTransferService.create(form).subscribe({
      next: () => alert("Transferencia creada"),
      error: (err) => alert(err.error?.message || "Error al crear la transferencia")
    });
  }

}
