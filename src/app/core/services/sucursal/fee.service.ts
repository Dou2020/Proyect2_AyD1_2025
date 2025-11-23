import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crea una tarifa
   */
  createSpecificFee(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/specificFee`, data);
  }

  /**
   * Obtiene las tarifas especificas de la sucursal
   */
  getFees(sucursalId: Number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sucursal/${sucursalId}/fees`);
  }

  /**
   * Modifica el listado completo, sobreescribe
   */
  modifyAll(data: any, sucursalId:Number): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/sucursal/${sucursalId}/fees`, data);
  }

  /**
   * Elimina una tarifa de la sucursal logueada
   */
  deleteFee(feeId:Number){
    return this.http.delete<any>(`${this.baseUrl}/specificFee/${feeId}`);
  }


}
