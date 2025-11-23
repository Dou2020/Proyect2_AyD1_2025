import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // Obtener tickets activos de la sucursal actual
  getActiveTickets(): Observable<TiketModel[]> {
    return this.getAllTickets().pipe(
      map(tickets => tickets.filter(ticket => ticket.endAt == null))
    );
  }
    searchTicketsByPlate(plate: string): Observable<TiketModel[]> {
    const query = (plate || '').trim().toLowerCase();
    if (!query) {
      return this.getAllTickets();
    }

    return this.getAllTickets().pipe(
      map(tickets =>
        tickets.filter(ticket => {
          const vehicle = (ticket as any).vehicle || {};
          const plateValue = (
            vehicle.plate ||
            vehicle.placa ||
            vehicle.licensePlate ||
            vehicle.licencePlate ||
            ''
          ).toString().toLowerCase();
          return plateValue.includes(query);
        })
      )
    );
  }
  // Obtener historial de tickets (sin recibir identificador)
  getTicketHistory(): Observable<TiketModel[]> {
    return this.getAllTickets();
  }

  /**
   * Obtiene el listado de tickets relacionados a un vehiculo
   * */ 
  getFacturation(vehicleId: Number): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/ticket/vehicle/${vehicleId}`);
  }
}
