import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/sucursal/groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  imports: [],
  templateUrl: './groups.html',
  styleUrl: './groups.css'
})
export class Groups implements OnInit {

  fleetDiscounts: any[] = [];

  constructor(
    private groupService: GroupService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.groupService.getOwned().subscribe({
      next: (data) => this.fleetDiscounts = data,
      error: () => alert("No se pudieron cargar los descuentos de flotillas") 
    })
  }

  viewDetails(id: any) {
    this.router.navigate([`subcursal/groups/tickets/${id}`]);
  }

}
