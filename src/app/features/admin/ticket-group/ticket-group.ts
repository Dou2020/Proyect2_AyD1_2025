import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupTicketService } from '../../../core/services/admin/groupTicket.service';
import { GroupTicketModel, GroupCreateModel } from '../../../core/models/admin/groupTicket.model';

@Component({
  selector: 'app-ticket-group',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket-group.html',
  styleUrl: './ticket-group.css'
})
export class TicketGroup implements OnInit {
  groupTickets = signal<GroupTicketModel[]>([]);
  filteredTickets = signal<GroupTicketModel[]>([]);
  groupId = signal<number | null>(null);

  searchTerm = signal('');
  isLoading = signal(false);
  loadingCreate = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  showCreateModal = signal(false);

  ticketForm: FormGroup;

  constructor(
    private groupTicketService: GroupTicketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Computed property for filtered tickets
  computedFilteredTickets = computed(() => {
    const tickets = this.groupTickets();
    const search = this.searchTerm().toLowerCase();

    if (!search) return tickets;

    return tickets.filter(ticket => {
      return ticket.ticket.sucursal.address.toLowerCase().includes(search) ||
             ticket.ticket.vehicle.plate.toLowerCase().includes(search) ||
             ticket.ticket.vehicle.color.toLowerCase().includes(search) ||
             ticket.quantity.toString().includes(search);
    });
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['groupId'];
      if (id) {
        this.groupId.set(id);
        this.loadGroupTickets(id);
      }
    });
  }

  loadGroupTickets(groupId: number) {
    this.isLoading.set(true);
    this.error.set(null);

    this.groupTicketService.getGroupTickets(groupId).subscribe({
      next: (tickets) => {
        this.groupTickets.set(tickets);
        console.log(this.groupTickets);
        this.filteredTickets.set(this.computedFilteredTickets());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading group tickets:', error);
        this.error.set('Error al cargar los tickets del grupo');
        this.isLoading.set(false);
        this.clearMessagesAfterDelay();
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filteredTickets.set(this.computedFilteredTickets());
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.ticketForm.reset();
    this.error.set(null);
    this.success.set(null);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.ticketForm.reset();
    this.error.set(null);
    this.success.set(null);
  }

  createGroupTicket() {
    if (this.ticketForm.invalid) {
      this.error.set('Por favor, completa todos los campos correctamente');
      this.clearMessagesAfterDelay();
      return;
    }

    const groupId = this.groupId();
    if (!groupId) {
      this.error.set('No se pudo obtener el ID del grupo');
      this.clearMessagesAfterDelay();
      return;
    }

    const payload: GroupCreateModel = {
      groupId: groupId,
      quantity: parseInt(this.ticketForm.value.quantity)
    };

    this.loadingCreate.set(true);
    this.error.set(null);

    this.groupTicketService.createGroupTicket(payload).subscribe({
      next: (response) => {
        console.log('Ticket de grupo creado exitosamente:', response);
        this.success.set('Ticket de grupo creado exitosamente');
        this.loadingCreate.set(false);
        this.closeCreateModal();
        this.loadGroupTickets(groupId); // Recargar la lista
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        console.error('Error creating group ticket:', error);
        this.error.set('Error al crear el ticket del grupo');
        this.loadingCreate.set(false);
        this.clearMessagesAfterDelay();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/grupos']);
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.error.set(null);
      this.success.set(null);
    }, 5000);
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  }

  getAvailabilityClass(isAvailable: boolean): string {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getAvailabilityText(isAvailable: boolean): string {
    return isAvailable ? 'Disponible' : 'No Disponible';
  }

  getVehicleTypeClass(type: string | undefined): string {
    if(type  == undefined) return "";
    switch (type.toLowerCase()) {
      case '2r':
      case 'motorcycle':
        return 'bg-blue-100 text-blue-800';
      case '4r':
      case 'car':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Statistics methods
  getTotalQuantity(): number {
    return this.computedFilteredTickets().reduce((sum, ticket) => sum + ticket.quantity, 0);
  }

  getAvailableTicketsCount(): number {
    return this.computedFilteredTickets().filter(ticket => ticket.isAvailable).length;
  }

  getOccupiedTicketsCount(): number {
    return this.computedFilteredTickets().filter(ticket => !ticket.isAvailable).length;
  }

  trackByTicket(index: number, item: GroupTicketModel): number {
    return item.id;
  }
}
