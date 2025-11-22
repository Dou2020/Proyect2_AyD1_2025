import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/client/vehicle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-vehicles',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './link-vehicles.html',
  styleUrl: './link-vehicles.css'
})
export class LinkVehicles {

  vehicleForm: FormGroup;
  searchPlate: string = '';
  searchedVehicle: any = null;
  searchNotFound = false;

  constructor(
    private fb: FormBuilder,
    private clientVehicleService: VehicleService
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', Validators.required],
      type: ['T2R', Validators.required],
      color: ['BLUE', Validators.required]
    });
  }

  submitVehicle() {
    if (this.vehicleForm.invalid) return;

    this.clientVehicleService.createVehicle(this.vehicleForm.value)
      .subscribe({
        next: () => alert('Vehículo registrado con éxito'),
        error: () => alert('Error al registrar el vehículo')
      });
  }

  searchVehicle() {
    this.searchedVehicle = null;
    this.searchNotFound = false;

    this.clientVehicleService.searchByPlate(this.searchPlate)
      .subscribe({
        next: (v: any) => this.searchedVehicle = v,
        error: () => this.searchNotFound = true
      });
  }

  linkVehicle(vehicleId: any) {
    this.clientVehicleService.linkVehicle(vehicleId)
      .subscribe({
        next: () => alert('Vehículo linkeado correctamente'),
        error: () => alert('No se pudo linkear el vehículo')
      });
  }
  
}
