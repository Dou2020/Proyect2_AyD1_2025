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

    // obtiene todos los carros de un usuario
    buySubscription(createVehicleSuscription: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/vehicleSubscription`, createVehicleSuscription);
    }

}
