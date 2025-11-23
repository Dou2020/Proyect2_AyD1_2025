import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { TemporalTransferModel } from '../../models/backoffice/temporalTransfer.model';

@Injectable({
  providedIn: 'root'
})
export class TemporalTransferService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las transferencias temporales (excepto PENDING)
  getTemporalTransfers(): Observable<TemporalTransferModel[]> {
    return this.http.get<TemporalTransferModel[]>(`${this.baseUrl}/temporalTransfer`);
  }

  // Obtener transferencias por estado específico (especialmente para PENDING)
  getTemporalTransfersByStatus(status: string): Observable<TemporalTransferModel[]> {
    return this.http.get<TemporalTransferModel[]>(`${this.baseUrl}/temporalTransfer/byStatus/${status}`);
  }

  // Obtener solo transferencias pendientes
  getPendingTemporalTransfers(): Observable<TemporalTransferModel[]> {
    return this.getTemporalTransfersByStatus('PENDING');
  }

  // Actualizar el estado de una transferencia temporal
  temporalTransferAccept(temporalTransferID: number): Observable<TemporalTransferModel> {
    return this.http.post<TemporalTransferModel>(`${this.baseUrl}/temporalTransfer/accept/${temporalTransferID}`, {});
  }
  temporalTransferReject(temporalTransferID: number): Observable<TemporalTransferModel> {
    return this.http.post<TemporalTransferModel>(`${this.baseUrl}/temporalTransfer/reject/${temporalTransferID}`, {});
  }
  temporalTransferBanned(temporalTransferID: number): Observable<TemporalTransferModel> {
    return this.http.delete<TemporalTransferModel>(`${this.baseUrl}/temporalTransfer/ban/${temporalTransferID}`, {});
  }

  //crear una transferencia temporal
  create(data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/temporalTransfer`, data);
  }

  findByUser(originalUserId: any, secondUserId: any) {
    const params = new HttpParams()
      .set('originalUserId', originalUserId)
      .set('secondUserId', secondUserId);

    return this.http.get<any>(`${this.baseUrl}/temporalTransfer`, { params });
  }

}
