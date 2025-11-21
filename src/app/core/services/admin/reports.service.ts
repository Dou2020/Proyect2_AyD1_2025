import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { paramSucursalOccupationsModel, reportSucursalOccupationsModel } from '../../models/admin/report.model';
import { paramSucursalBillingModel, reportSucursalBillingModel } from '../../models/admin/report.model';
import { paramSubscriptionModel, reportSubscriptionModel } from '../../models/admin/report.model';
import { paramCommerceGivenBenefitsModel, reportCommerceGivenBenefitsModel } from '../../models/admin/report.model';
import { paramIncidentsModel, reportIncidentsModel } from '../../models/admin/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener reporte de ocupaciones por sucursal (enviando params por GET)
  getSucursalOccupationsReport(params: paramSucursalOccupationsModel): Observable<reportSucursalOccupationsModel> {
    const queryParams: { [key: string]: string } = {};
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : String(value);
      }
    });

    return this.http.get<reportSucursalOccupationsModel>(`${this.baseUrl}/reports/sucursalOccupations`, { params: queryParams });
  }
  // Obtener reporte de facturación por sucursal (enviando params por GET)
  getSucursalBillingReport(params: paramSucursalBillingModel): Observable<reportSucursalBillingModel> {
    const queryParams: { [key: string]: string } = {};
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : String(value);
      }
    });

    return this.http.get<reportSucursalBillingModel>(`${this.baseUrl}/reports/sucursalBilling`, { params: queryParams });
  }

  // Obtener reporte de suscripciones (enviando params por GET)
  getSubscriptionReport(params: paramSubscriptionModel): Observable<reportSubscriptionModel[]> {
    const queryParams: { [key: string]: string } = {};
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : String(value);
      }
    });

    return this.http.get<reportSubscriptionModel[]>(`${this.baseUrl}/reports/subscription`, { params: queryParams });
  }

  // Obtener reporte de beneficios otorgados a comercios (enviando params por GET)
  getCommerceGivenBenefitsReport(params: paramCommerceGivenBenefitsModel): Observable<reportCommerceGivenBenefitsModel[]> {
    const queryParams: { [key: string]: string } = {};
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : String(value);
      }
    });

    return this.http.get<reportCommerceGivenBenefitsModel[]>(`${this.baseUrl}/reports/commerceBenefits`, { params: queryParams });
  }

  // Obtener reporte de incidentes (enviando params por GET)
  getIncidentsReport(params: paramIncidentsModel): Observable<reportIncidentsModel[]> {
    const queryParams: { [key: string]: string } = {};
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : String(value);
      }
    });

    return this.http.get<reportIncidentsModel[]>(`${this.baseUrl}/reports/incidents`, { params: queryParams });
  }
}
