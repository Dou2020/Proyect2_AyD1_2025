import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiketService } from '../../../core/services/sucursal/tiket.service';
import { TiketModel, TiketUpdateModel } from '../../../core/models/sucursal/tiket.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket implements OnInit {
  // Signals para el estado de la aplicación
  tickets = signal<TiketModel[]>([]);
  activeTickets = signal<TiketModel[]>([]);
  selectedTicket = signal<TiketModel | null>(null);
  loading = signal(false);
  searchPlate = signal('');
  showCreateModal = signal(false);
  showDetailsModal = signal(false);
  showEndModal = signal(false);
  currentView = signal<'all' | 'active' | 'history'>('all');

  // Formularios
  createTicketForm: FormGroup;
  endTicketForm: FormGroup;

  constructor(
    private tiketService: TiketService,
    private fb: FormBuilder
  ) {
    this.createTicketForm = this.fb.group({
      vehicleId: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.endTicketForm = this.fb.group({
      endAt: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadAllTickets();
    this.loadActiveTickets();
  }

  // Cargar todos los tickets
  loadAllTickets() {
    this.loading.set(true);
    this.tiketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading.set(false);
      }
    });
  }

  // Cargar tickets activos
  loadActiveTickets() {
    this.tiketService.getActiveTickets().subscribe({
      next: (tickets) => {
        this.activeTickets.set(tickets);
      },
      error: (error) => {
        console.error('Error loading active tickets:', error);
      }
    });
  }

  // Buscar tickets por placa
  searchByPlate() {
    if (!this.searchPlate()) return;

    this.loading.set(true);
    this.tiketService.searchTicketsByPlate(this.searchPlate()).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching tickets:', error);
        this.loading.set(false);
      }
    });
  }

  // Crear nuevo ticket
  createTicket() {
    if (this.createTicketForm.invalid) return;

    this.loading.set(true);
    const vehicleId = this.createTicketForm.value.vehicleId;

    this.tiketService.createTiket(vehicleId).subscribe({
      next: (ticket) => {
        this.loadAllTickets();
        this.loadActiveTickets();
        this.closeCreateModal();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.loading.set(false);
      }
    });
  }

  // Finalizar ticket
  endTicket() {
    if (this.endTicketForm.invalid || !this.selectedTicket()) return;

    this.loading.set(true);
    const updateData: TiketUpdateModel = {
      ticketId: this.selectedTicket()!.id.toString(),
      endAt: this.endTicketForm.value.endAt
    };

    this.tiketService.updateTiket(this.selectedTicket()!.id, updateData).subscribe({
      next: (ticket) => {
        this.loadAllTickets();
        this.loadActiveTickets();
        this.closeEndModal();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error ending ticket:', error);
        this.loading.set(false);
      }
    });
  }

  // Ver detalles del ticket
  viewDetails(ticket: TiketModel) {
    this.selectedTicket.set(ticket);
    this.showDetailsModal.set(true);
  }

  // Preparar finalización de ticket
  prepareEndTicket(ticket: TiketModel) {
    this.selectedTicket.set(ticket);
    this.endTicketForm.patchValue({
      endAt: new Date().toISOString().slice(0, 16)
    });
    this.showEndModal.set(true);
  }

  // Cambiar vista
  changeView(view: 'all' | 'active' | 'history') {
    this.currentView.set(view);
    switch(view) {
      case 'all':
        this.loadAllTickets();
        break;
      case 'active':
        this.loadActiveTickets();
        break;
      case 'history':
        this.tiketService.getTicketHistory().subscribe({
          next: (tickets) => this.tickets.set(tickets),
          error: (error) => console.error('Error loading history:', error)
        });
        break;
    }
  }

  // Gestión de modales
  openCreateModal() {
    this.showCreateModal.set(true);
    this.createTicketForm.reset();
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedTicket.set(null);
  }

  closeEndModal() {
    this.showEndModal.set(false);
    this.selectedTicket.set(null);
  }

  // Utilidades
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  calculateDuration(createdAt: string, endAt: string | null): string {
    if (!endAt) return 'Activo';

    const start = new Date(createdAt);
    const end = new Date(endAt);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  getStatusClass(ticket: TiketModel): string {
    return ticket.endAt ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';
  }

  getStatusText(ticket: TiketModel): string {
    return ticket.endAt ? 'Finalizado' : 'Activo';
  }
}
