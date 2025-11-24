import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FeeService } from '../../../core/services/sucursal/fee.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  schedules: any[] = [];

  showCreate = false;
  showEditModal = false;

  createMode: 'add' | 'overwrite' = 'add';

  newSchedule = {
    initHour: '',
    endHour: '',
    price: 0
  };

  editSchedule: any = {};

  sucursalId = 0;
  private feeId:Number = 0;

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
      },
      error: () => alert('Error al cargar los horarios')
    });
  }

  createSchedule() {

    if (this.createMode === 'overwrite') {
      const payload = [
        {
          initHour: this.newSchedule.initHour,
          endHour: this.newSchedule.endHour,
          price: this.newSchedule.price
        }
      ];

      this.feeService.modifyAll(payload, this.sucursalId).subscribe({
        next: () => {
          alert('Horarios sobrescritos correctamente');
          this.loadSchedules();
          this.resetCreateForm();
        },
        error: (err) => alert(err.error.message ?? "Error al sobreescribir")
      });

    } else {
      const payload = {
        initHour: this.newSchedule.initHour,
        endHour: this.newSchedule.endHour,
        price: this.newSchedule.price
      };
      this.feeService.createSpecificFee(payload, this.sucursalId).subscribe({
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
      price: 0
    };
    this.showCreate = false;
  }

  openEditModal(schedule: any) {
    this.editSchedule = {
      initHour: schedule.initHour,
      endHour: schedule.endHour,
      price: schedule.price
    };
    this.showEditModal = true;
    this.feeId = Number(schedule.id);
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateSchedule() {
    
    this.feeService.edit(this.editSchedule, this.sucursalId, this.feeId).subscribe({
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

    this.feeService.deleteFee(id, this.sucursalId).subscribe({
      next: () => {
        alert('Horario eliminado');
        this.loadSchedules();
      },
      error: () => alert('Error al eliminar el horario')
    });
  }

}
