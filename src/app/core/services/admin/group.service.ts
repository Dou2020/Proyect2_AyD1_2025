import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroments';
import { Observable } from 'rxjs';
import { GroupModel, GroupCreateModel } from '../../models/admin/group.model';
import { CommerceModel } from '../../models/admin/commerce.model';
import { SubcursalModel } from '../../models/admin/subcursal.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // visualizar todos los grupos
  getGroups(): Observable<GroupModel[]> {
    return this.http.get<GroupModel[]>(`${this.baseUrl}/group/all`);
  }

  // crear un nuevo grupo
  createGroup(payload: GroupCreateModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/group`, payload);
  }

  // obtener todos los comercios
  getAllCommerces(): Observable<CommerceModel[]> {
    return this.http.get<CommerceModel[]>(`${this.baseUrl}/commerce`);
  }

  // obtener todas las subcursales
  getAllSubcursals(): Observable<SubcursalModel[]> {
    return this.http.get<SubcursalModel[]>(`${this.baseUrl}/sucursal`);
  }


}
