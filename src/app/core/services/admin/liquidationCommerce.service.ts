import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { LiquidationCommerceModel, ParamLiquidationCommerceModel } from '../../models/admin/liquidationCommerce.model';

@Injectable({
  providedIn: 'root'
})
export class LiquidationCommerceService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener la liquidación de comercio
  getLiquidation(commerceId: number, params: ParamLiquidationCommerceModel): Observable<LiquidationCommerceModel> {
    return this.http.get<LiquidationCommerceModel>(`${this.baseUrl}/commerceLiquidation/${commerceId}`, { params: params as any});
  }

  postLiquidation(commerceId: number, params: ParamLiquidationCommerceModel): Observable<LiquidationCommerceModel> {
    return this.http.post<LiquidationCommerceModel>(`${this.baseUrl}/commerceLiquidation/${commerceId}`, params);
  }



}
