import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/sucursal/groups.service';
import { ticketGroupService } from '../../../core/services/sucursal/ticketGroup.service';

@Component({
  selector: 'app-groups',
  imports: [],
  templateUrl: './groups.html',
  styleUrl: './groups.css'
})
export class Groups implements OnInit {

  fleetDiscounts: any[] = [];

  constructor(
    private groupService: GroupService
  ){}

  ngOnInit(): void {
    this.groupService.getOwned().subscribe({
      next: (data) => this.fleetDiscounts = data,
      error: () => alert("No se pudieron cargar los descuentos de flotillas") 
    })
  }

  viewDetails(item: any) {
    console.log('Detalles del descuento:', item);
    // aquí puedes abrir un modal o navegar a otra vista
  }

}
