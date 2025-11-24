import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ticketGroupService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los grupos con descuentos en la sucursal
   */
  getOwned(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/group`);
  }



}
