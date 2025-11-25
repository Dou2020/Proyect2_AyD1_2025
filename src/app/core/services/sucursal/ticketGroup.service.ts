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

  /**
   * Obtiene todos los tickets de una flotilla especifica
  */
  getTicketsFromGroup(groupId:Number): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/ticketGroup/${groupId}`)
  }

  /**
   * Registra el ingreso de un ticket de un carro de una flotilla
   */
  registerEntryInGroup(data: any){
    return this.http.post<any>(`${this.baseUrl}/ticketGroup/registerEntry`,data)
  }

  /** 
   * Registrar el egreso de un ticket de flotilla
   */
  registerEndInGroup(data:any){
    return this.http.post<any>(`${this.baseUrl}/ticketGroup/registerExit`,data)
  }

}
