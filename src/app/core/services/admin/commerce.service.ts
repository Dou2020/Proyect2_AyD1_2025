import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { CommerceCreateModel, CommerceAffiliateCreateModel } from '../../models/admin/commerce.model';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Crear un nuevo comercio
  createCommerce(payload: CommerceCreateModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/commerce`, payload);
  }

  // Afiliar un comercio a una subcursal
  affiliateCommerceToSubcursal(payload: CommerceAffiliateCreateModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/commerce/affiliate`, payload);
  }

}
