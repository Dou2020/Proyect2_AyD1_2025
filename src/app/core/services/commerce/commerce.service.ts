import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { AffiliateSubcursalModel, CommerceAffiliateCreateModel } from '../../models/admin/commerce.model';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las subcursales
  getSubcursals(commerceId: number): Observable<AffiliateSubcursalModel[]> {
    return this.http.get<AffiliateSubcursalModel[]>(`${this.baseUrl}/commerce/${commerceId}/sucursal`);
  }

  // Crear CommerceAffiliateCreateModel
  affiliateSubcursalToCommerce(payload: CommerceAffiliateCreateModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/commerce/affiliateSubcursal`, payload);
  }
}
