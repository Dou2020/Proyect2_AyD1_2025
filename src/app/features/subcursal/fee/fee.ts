import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FeeService } from '../../../core/services/sucursal/fee.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth as AuthService } from '../../../core/auth/auth';
import { sucursalService } from '../../../core/services/sucursal/sucursal.service';

@Component({
  selector: 'app-fee',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './fee.html',
  styleUrl: './fee.css'
})
export class Fee implements OnInit {

  /*private authService = inject(AuthService);
  private userId = this.authService.getUserData()?.id;*/

  schedules: any[] = [];

  showCreate = false;
  showEditModal = false;

  createMode: 'add' | 'overwrite' = 'add';

  newSchedule = {
    initHour: '',
    endHour: '',
    price: 0,
    sucursalId: 0
  };

  editSchedule: any = {};

  sucursalId = 0;

  constructor(
    private feeService: FeeService,
    private sucursalService: sucursalService
  ) { }

  ngOnInit() {
    this.sucursalService.getProfile().subscribe({
      next: (data) => {
        this.sucursalId = data.id;
        this.loadSchedules();
      }
    });
  }

  loadSchedules() {
    this.feeService.getFees(this.sucursalId).subscribe({
      next: (data) => {
        this.schedules = data ?? [];
        console.log(data);
      },
      error: () => alert('Error al cargar los horarios')
    });
  }

  createSchedule() {

    if (this.createMode === 'overwrite') {
      // Sobrescribir todo
      const payload = [this.newSchedule];

      this.feeService.modifyAll(payload, this.sucursalId).subscribe({
        next: () => {
          alert('Horarios sobrescritos correctamente');
          this.loadSchedules();
          this.resetCreateForm();
        },
        error: () => alert('Error al sobrescribir los horarios')
      });

    } else {
      // Agregar
      const payload = {
        initHour: this.newSchedule.initHour,
        endHour: this.newSchedule.endHour,
        price: this.newSchedule.price
      };

      this.feeService.createSpecificFee(payload).subscribe({
        next: () => {
          alert('Horario creado correctamente');
          this.loadSchedules();
          this.resetCreateForm();
        },
        error: () => alert('Error al crear el horario')
      });
    }
  }

  resetCreateForm() {
    this.newSchedule = {
      initHour: '',
      endHour: '',
      price: 0,
      sucursalId: this.sucursalId
    };
    this.showCreate = false;
  }

  openEditModal(schedule: any) {
    this.editSchedule = { ...schedule }; // copia
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateSchedule() {
    const payload = [this.editSchedule];

    this.feeService.modifyAll(payload, this.sucursalId).subscribe({
      next: () => {
        alert('Horario actualizado');
        this.loadSchedules();
        this.showEditModal = false;
      },
      error: () => alert('Error al actualizar el horario')
    });
  }

  deleteSchedule(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este horario?')) return;

    this.feeService.deleteFee(id).subscribe({
      next: () => {
        alert('Horario eliminado');
        this.loadSchedules();
      },
      error: () => alert('Error al eliminar el horario')
    });
  }

}
