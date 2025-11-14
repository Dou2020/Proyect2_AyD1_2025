import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { SubscriptionModel } from '../../models/admin/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las suscripciones
  getSubscriptions(): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(`${this.baseUrl}/subscription`);
  }

  // Crear una nueva suscripción
  createSubscription(payload: Partial<SubscriptionModel>): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(`${this.baseUrl}/subscription`, payload);
  }

  // Actualizar una suscripción existente
  updateSubscription(id: number, payload: Partial<SubscriptionModel>): Observable<SubscriptionModel> {
    return this.http.put<SubscriptionModel>(`${this.baseUrl}/subscription/${id}`, payload);
  }

  // Eliminar una suscripción
  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subscription/${id}`);
  }

}
