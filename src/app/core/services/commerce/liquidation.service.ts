import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { LiquidationModel, ParamLiquidationModel } from '../../models/commerce/liquidation.model';

@Injectable({
  providedIn: 'root'
})
export class LiquidationService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener liquidación para un comercio específico
    getLiquidation(params: ParamLiquidationModel): Observable<LiquidationModel> {
      const httpParams = new HttpParams({ fromObject: params as any });
      return this.http.get<LiquidationModel>(`${this.baseUrl}/commerceLiquidation`, { params: httpParams });
    }

    // crear liquidación para un comercio específico (envía params como HttpParams)
    createLiquidation(params: ParamLiquidationModel): Observable<LiquidationModel> {
      const httpParams = new HttpParams({ fromObject: params as any });
      return this.http.post<LiquidationModel>(`${this.baseUrl}/commerceLiquidation`, null, { params: httpParams });
    }


}
