import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { DashboardModel, DashboardSucursalModel, DashboardSucursalUpdateModel } from '../../models/admin/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener datos del dashboard general
  getDashboard(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(`${this.baseUrl}/adminDashboard`);
  }

  // Obtener datos del dashboard de una subcursal específica
  getDashboardSucursal(subcursalId: number): Observable<DashboardSucursalModel> {
    return this.http.get<DashboardSucursalModel>(`${this.baseUrl}/adminDashboard/${subcursalId}`);
  }

  // Obtener estadísticas de todas las subcursales actuales
  getDashboardSucursales(sucursalId: number): Observable<DashboardSucursalUpdateModel> {
    return this.http.get<DashboardSucursalUpdateModel>(`${this.baseUrl}/adminDashboard/update/${sucursalId}`);
  }

}
