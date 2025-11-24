import { Component, inject, OnInit } from '@angular/core';
import { ticketGroupService } from '../../../core/services/sucursal/ticketGroup.service';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-group',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './ticket-group.html',
  styleUrl: './ticket-group.css'
})
export class TicketGroup implements OnInit{

  groupTickets: any[] = [];
  groupId = Number(inject(ActivatedRoute).snapshot.paramMap.get('groupId'));

  constructor(
    private ticketGroupService: ticketGroupService,
    private route: ActivatedRoute
  ){}
    

  ngOnInit(): void {
    this.loadGroupTickets();
  }

  loadGroupTickets() {
    this.ticketGroupService.getTicketsFromGroup(Number(this.groupId)).subscribe({
      next: (data) => {
        this.groupTickets = data ?? [];
        console.log('Group Tickets:', this.groupTickets);
      },
      error: (err) => {
        console.error('Error cargando tickets de grupo', err);
        alert(err.error?.message ?? 'No se pudieron cargar los tickets de grupo');
      }
    });
  }


  ingreso = {
    ticketGroupId: 0,
    vehiclePlate: ''
  };

  egreso = {
    ticketGroupId: 0,
    endAt: ''
  };

  registrarIngreso() {
    this.ticketGroupService.registerEntryInGroup(this.ingreso).subscribe({
      next: () => {
        alert("Entrada registrada exitosamente");
        this.loadGroupTickets();
      },
      error: (err) => alert("Ocurrio un error" + err.error.message)
    })
  }

  registrarEgreso() {
    this.ticketGroupService.registerEndInGroup(this.egreso).subscribe({
      next: (data) => {
        alert("Salida registrada exitosamente");
        this.loadGroupTickets();
      },
      error: (err) => alert("Ocurrio un error" + err.error.message)
    })
  }



}
