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
  getSucursalOccupationsReport(filters: paramSucursalOccupationsModel): Observable<reportSucursalOccupationsModel> {
    const params: any = {};
    if (filters.sucursalId !== undefined && filters.sucursalId !== null) params.sucursalId = filters.sucursalId;
    return this.http.get<reportSucursalOccupationsModel>(`${this.baseUrl}/reports/sucursalOccupations`, { params });
  }

  getSucursalBillingReport(params: paramSucursalBillingModel): Observable<reportSucursalBillingModel> {
    const query: any = {};
    if (params.startDate) query.startDate = params.startDate;
    if (params.endDate) query.endDate = params.endDate;
    if (params.sucursalId !== undefined && params.sucursalId !== null) query.sucursalId = params.sucursalId;
    return this.http.get<reportSucursalBillingModel>(`${this.baseUrl}/reports/sucursalBilling`, { params: query });
  }

  // Obtener reporte de suscripciones (enviando params por GET)
  getSubscriptionReport(params: paramSubscriptionModel): Observable<reportSubscriptionModel[]> {
    const queryParams: any = {};
    if (params.subscriptionPlanId !== undefined && params.subscriptionPlanId !== null) queryParams.subscriptionPlanId = params.subscriptionPlanId;
    if (params.activeOrInactive !== undefined && params.activeOrInactive !== null) queryParams.activeOrInactive = params.activeOrInactive;
    if (params.userId !== undefined && params.userId !== null) queryParams.userId = params.userId;
    if (params.vehiclePlate) queryParams.vehiclePlate = params.vehiclePlate;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.vehicleId !== undefined && params.vehicleId !== null) queryParams.vehicleId = params.vehicleId;
    return this.http.get<reportSubscriptionModel[]>(`${this.baseUrl}/reports/subscription`, { params: queryParams });
  }

  // Obtener reporte de beneficios otorgados a comercios (enviando params por GET)
  getCommerceGivenBenefitsReport(params: paramCommerceGivenBenefitsModel): Observable<reportCommerceGivenBenefitsModel[]> {
    const queryParams: any = {};
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.vehiclePlate) queryParams.vehiclePlate = params.vehiclePlate;
    if (params.commerceId !== undefined && params.commerceId !== null) queryParams.commerceId = params.commerceId;
    if (params.clientId !== undefined && params.clientId !== null) queryParams.clientId = params.clientId;
    return this.http.get<reportCommerceGivenBenefitsModel[]>(`${this.baseUrl}/reports/commerceBenefits`, { params: queryParams });
  }

  // Obtener reporte de incidentes (enviando params por GET)
  getIncidentsReport(params: paramIncidentsModel): Observable<reportIncidentsModel[]> {
    const queryParams: any = {};
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.ticketId !== undefined && params.ticketId !== null) queryParams.ticketId = params.ticketId;
    if (params.clientId !== undefined && params.clientId !== null) queryParams.clientId = params.clientId;
    if (params.vehiclePlate) queryParams.vehiclePlate = params.vehiclePlate;
    if (params.status) queryParams.status = params.status;
    if (params.description) queryParams.description = params.description;
    return this.http.get<reportIncidentsModel[]>(`${this.baseUrl}/reports/incidents`, { params: queryParams });
  }
}
