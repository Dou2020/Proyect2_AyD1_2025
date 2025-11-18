import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { BaseFreeModel, NewValueModel } from '../../models/admin/baseFree.model';

@Injectable({
  providedIn: 'root'
})
export class BaseFreeService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  // Obtener todas las tarifas base
  getBaseFrees(): Observable<BaseFreeModel> {
    return this.http.get<BaseFreeModel>(`${this.baseUrl}/baseFee`);
  }
  // Actualizar una tarifa base existente — devuelve NewValueModel
  updateBaseFree(payload: NewValueModel): Observable<NewValueModel> {
    return this.http.put<NewValueModel>(`${this.baseUrl}/baseFee`, payload);
  }
}
