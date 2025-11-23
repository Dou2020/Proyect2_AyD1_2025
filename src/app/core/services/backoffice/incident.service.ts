import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { IncidentModel, IncidentUpdateModel, IncidentCreateModel } from '../../models/backoffice/incident.model';

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

  // Crear una nueva incidencia (siempre envía multipart/form-data)
  createIncident(incidentData: Partial<IncidentCreateModel>, file?: File): Observable<IncidentModel> {
    const formData = new FormData();

    // Siempre añadir la parte 'data' como JSON string
    formData.append('data', new Blob([JSON.stringify(incidentData || {})], { type: 'application/json' }));

    // Añadir archivo solo si se proporciona
    if (file) {
      formData.append('file', file, file.name);
    }

    // El navegador establecerá automáticamente el Content-Type correcto para multipart/form-data
    return this.http.post<IncidentModel>(`${this.baseUrl}/incident`, formData);
  }

}
