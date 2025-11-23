import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class VehicleSubscriptionService {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Compara una suscripcion
     * @param createVehicleSuscription 
     * @returns el response
     */
    buySubscription(createVehicleSuscription: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/vehicleSubscription`, createVehicleSuscription);
    }

    findCurrentSubscription(vehicleId: Number):Observable<any>{
        return this.http.get<any>(`${this.baseUrl}/vehicleSubscription/${vehicleId}`);
    }


}
