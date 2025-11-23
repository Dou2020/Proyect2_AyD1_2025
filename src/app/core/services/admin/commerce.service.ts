import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../enviroments/enviroments';
import { CommerceCreateModel, CommerceAffiliateCreateModel, AffiliateCommerceModel, AffiliateSubcursalModel, CommerceModel } from '../../models/admin/commerce.model';

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
    console.log('Affiliating commerce with payload:', payload);
    return this.http.post<any>(`${this.baseUrl}/affiliatedCommerce`, payload);
  }

    // Obtener comercios afiliados a una subcursal
    getAffiliateCommerces(subcursalId: number): Observable<AffiliateCommerceModel[]> {
      return this.http.get<AffiliateCommerceModel[]>(`${this.baseUrl}/sucursal/${subcursalId}/affiliatedCommerce`);
    }

    // Obtener todos los comercios que NO estén afiliados a la subcursal indicada
    getCommerceAll(subcursalId: number): Observable<CommerceModel[]> {
      // requiere importar forkJoin desde 'rxjs' y map desde 'rxjs/operators'
      return forkJoin({
        all: this.http.get<CommerceModel[]>(`${this.baseUrl}/commerce`),
        affiliated: this.getAffiliateCommerces(subcursalId)
      }).pipe(
        map(({ all, affiliated }) => {
          const getId = (x: any) => x?.id ?? x?.commerceId ?? x?.commerce?.id;
          const affiliatedIds = new Set(affiliated.map(getId));
          return all.filter(c => !affiliatedIds.has(getId(c)));
        })
      );
    }

    // Obtener todas las subcursales que NO estén afiliadas al comercio indicado
    getSubcursalsNotAffiliated(commerceId: number): Observable<any[]> {
      return forkJoin({
        allSubcursals: this.http.get<any[]>(`${this.baseUrl}/sucursal`),
        affiliatedSubcursals: this.http.get<AffiliateSubcursalModel[]>(`${this.baseUrl}/commerce/${commerceId}/sucursal`)
      }).pipe(
        map(({ allSubcursals, affiliatedSubcursals }) => {
          const affiliatedIds = new Set(affiliatedSubcursals.map(item => item.sucursal?.id));
          return allSubcursals.filter(subcursal => !affiliatedIds.has(subcursal.id));
        })
      );
    }

}
