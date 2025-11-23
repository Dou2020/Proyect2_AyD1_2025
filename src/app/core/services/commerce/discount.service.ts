import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { DiscountModel, DiscountCreateModel, ParamDiscountModel } from '../../models/commerce/discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los descuentos (params opcionales -> query params)
  getDiscounts(params?: ParamDiscountModel): Observable<DiscountModel[]> {
    const query: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach(key => {
        const val = (params as any)[key];
        if (val !== undefined && val !== null) {
          query[key] = String(val);
        }
      });
    }
    return this.http.get<DiscountModel[]>(`${this.baseUrl}/discount`, { params: query });
  }
  // obtener un descuento por ID
  getDiscountById(id: number): Observable<DiscountModel> {
    return this.http.get<DiscountModel>(`${this.baseUrl}/discount/${id}`);
  }

  // Crear un nuevo descuento
  createDiscount(payload: DiscountCreateModel): Observable<DiscountModel> {
    return this.http.post<DiscountModel>(`${this.baseUrl}/discount`, payload);
  }


}
