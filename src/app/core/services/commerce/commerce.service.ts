import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { AffiliateSubcursalModel, CommerceAffiliateCreateModel } from '../../models/admin/commerce.model';
import { AffiliateCommerceModel } from '../../models/admin/commerce.model';

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

  // Obtener comercios afiliados a una subcursal
  getAffiliateCommerces(subcursalId: number): Observable<AffiliateCommerceModel[]> {
    return this.http.get<AffiliateCommerceModel[]>(`${this.baseUrl}/sucursal/${subcursalId}/affiliatedCommerce`);
  }

  // Obtener todos los comercios que NO estén afiliados a la subcursal indicada
  getCommerceAll(subcursalId: number): Observable<AffiliateSubcursalModel[]> {
    // requiere importar forkJoin desde 'rxjs' y map desde 'rxjs/operators'
    return forkJoin({
      all: this.http.get<AffiliateSubcursalModel[]>(`${this.baseUrl}/commerce`),
      affiliated: this.getAffiliateCommerces(subcursalId)
    }).pipe(
      map(({ all, affiliated }) => {
        const getId = (x: any) => x?.id ?? x?.commerceId ?? x?.commerce?.id;
        const affiliatedIds = new Set(affiliated.map(getId));
        return all.filter(c => !affiliatedIds.has(getId(c)));
      })
    );
  }

}

