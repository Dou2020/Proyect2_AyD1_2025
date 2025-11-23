import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiketService as TicketService} from '../../../core/services/sucursal/tiket.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-facturation',
  imports: [DatePipe],
  templateUrl: './facturation.html',
  styleUrl: './facturation.css'
})
export class Facturation implements OnInit{

  vehicleId = Number(inject(ActivatedRoute).snapshot.paramMap.get('vehicleId'));

  tickets: any[] = [];

  constructor(
    private ticketService: TicketService
  ){}

  ngOnInit() {
    this.ticketService.getFacturation(this.vehicleId).subscribe({
      next: (data) => this.tickets = data,
      error: () => alert("No se pudo cargar la facturacion")
    })
  }
  
}
