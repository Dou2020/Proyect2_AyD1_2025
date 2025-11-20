import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { IncidentModel, IncidentUpdateModel } from '../../models/backoffice/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las incidencias (con parámetros opcionales: text y status)
  getIncidents(status?: string): Observable<IncidentModel[]> {
    const params: { [key: string]: string } = {};
    if (status) params['status'] = status;
    return this.http.get<IncidentModel[]>(`${this.baseUrl}/incident`, { params });
  }

  // Obtener todas las incidencias de status REPORTED
  getReportedIncidents(): Observable<IncidentModel[]> {
    return this.getIncidents('REPORTED');
  }
  // Obtener todas las incidencias de status RESOLVED
  getResolvedIncidents(): Observable<IncidentModel[]> {
    return this.getIncidents('RESOLVED');
  }

  // Actualizar el estado de una incidencia
  updateIncident(incidentID: number, updateData: IncidentUpdateModel): Observable<IncidentModel> {
    return this.http.put<IncidentModel>(`${this.baseUrl}/incident/${incidentID}`, updateData);
  }

  // Crear una nueva incidencia
  createIncident(incidentData: Partial<IncidentModel>): Observable<IncidentModel> {
    return this.http.post<IncidentModel>(`${this.baseUrl}/incident`, incidentData);
  }

}
