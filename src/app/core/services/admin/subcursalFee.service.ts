import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { SubcursalFreeModel, SubcursalFreeCreateModel } from '../../models/admin/subcursalFree.model';

@Injectable({
  providedIn: 'root'
})
export class SubcursalFeeService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener toas las tarifas de subcursales
  getSubcursalFees(SubcursalId: number): Observable<SubcursalFreeModel[]> {
    return this.http.get<SubcursalFreeModel[]>(`${this.baseUrl}/sucursal/${SubcursalId}/fees`);
  }

  // Crear una nueva tarifa de subcursal
  createSubcursalFee(SubcursalId: number, payload: SubcursalFreeCreateModel): Observable<SubcursalFreeModel> {
    return this.http.post<SubcursalFreeModel>(`${this.baseUrl}/sucursal/${SubcursalId}/fees`, payload);
  }

  // Actualizar una tarifa de subcursal
  updateSubcursalFee(feeId: number, subcursalId: number,  payload: SubcursalFreeCreateModel): Observable<SubcursalFreeModel> {
    return this.http.put<SubcursalFreeModel>(`${this.baseUrl}/sucursal/${subcursalId}/fees/${feeId}`, payload);
  }

  // Eliminar una tarifa de subcursal
  deleteSubcursalFee(feeId: number): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/especificFee/${feeId}`);
  }

}
