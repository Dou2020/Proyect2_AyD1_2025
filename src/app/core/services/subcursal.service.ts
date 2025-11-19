import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { SubcursalModel, SubcursalCreateModel, SubcursalUpdateModel } from '../models/admin/subcursal.model';
import { AffiliateCommerceModel } from '../models/admin/commerce.model';

@Injectable({
  providedIn: 'root'
})
export class SubcursalService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las subcursales
  getSubcursals(): Observable<SubcursalModel[]> {
    return this.http.get<SubcursalModel[]>(`${this.baseUrl}/sucursal`);
  }

  // Crear una nueva subcursal
  createSubcursal(payload: SubcursalCreateModel): Observable<SubcursalModel> {
    return this.http.post<SubcursalModel>(`${this.baseUrl}/sucursal`, payload);
  }

  // Actualizar una subcursal existente
  updateSubcursal(id: number, payload: SubcursalUpdateModel): Observable<SubcursalModel> {
    return this.http.put<SubcursalModel>(`${this.baseUrl}/sucursal/${id}`, payload);
  }

  // Eliminar una subcursal
  deleteSubcursal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sucursal/${id}`);
  }

  // Obtener comercios afiliados a una subcursal
  getAffiliateCommerces(subcursalId: number): Observable<AffiliateCommerceModel[]> {
    return this.http.get<AffiliateCommerceModel[]>(`${this.baseUrl}/sucursal/${subcursalId}/affiliatedCommerce`);
  }

}
