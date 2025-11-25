import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class sucursalService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene su perfil
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sucursal/profile`);
  }

  /**
   * Obtiene datos en tiempo real
  */
  getLiveProfile(sucursalId: any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/adminDashboard/update/${sucursalId}`)
  }

}
