import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { GroupTicketModel, GroupCreateModel } from '../../models/admin/groupTicket.model';

@Injectable({
  providedIn: 'root'
})
export class GroupTicketService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}


  // visualizar todos los grupos de tickets
  getGroupTickets(groupId: Number): Observable<GroupTicketModel[]> {
    return this.http.get<GroupTicketModel[]>(`${this.baseUrl}/ticketGroup/${groupId}`);
  }

  // crear un nuevo grupo de tickets
  createGroupTicket(payload: GroupCreateModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ticketGroup`, payload);
  }

}
