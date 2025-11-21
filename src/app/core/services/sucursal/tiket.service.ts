import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { TiketModel, TiketUpdateModel } from '../../models/sucursal/tiket.model';

@Injectable({
  providedIn: 'root'
})
export class TiketService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Crear un nuevo tiket
  createTiket(vehicleId: string): Observable<TiketModel> {
    return this.http.post<TiketModel>(`${this.baseUrl}/ticket/${vehicleId}`, {});
  }

  // Obtener un tiket por ID
  getTiketById(tiketID: number): Observable<TiketModel> {
    return this.http.get<TiketModel>(`${this.baseUrl}/ticket/${tiketID}`);
  }

  // Actualizar un tiket (finalizar)
  updateTiket(tiketID: number, updateData: TiketUpdateModel): Observable<TiketModel> {
    return this.http.patch<TiketModel>(`${this.baseUrl}/ticket/end`, updateData);
  }

  // Obtener todos los tickets de la sucursal actual
  getAllTickets(): Observable<TiketModel[]> {
    return this.http.get<TiketModel[]>(`${this.baseUrl}/ticket`);
  }

  // Obtener tickets activos (sin endAt)
  getActiveTickets(): Observable<TiketModel[]> {
    return this.http.get<TiketModel[]>(`${this.baseUrl}/ticket/active`);
  }

  // Buscar tickets por placa del vehículo
  searchTicketsByPlate(plate: string): Observable<TiketModel[]> {
    return this.http.get<TiketModel[]>(`${this.baseUrl}/ticket/search`, {
      params: { plate }
    });
  }

  // Obtener historial de tickets
  getTicketHistory(limit?: number): Observable<TiketModel[]> {
    let url = `${this.baseUrl}/ticket/history`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return this.http.get<TiketModel[]>(url);
  }
}
