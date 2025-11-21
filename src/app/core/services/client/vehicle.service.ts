import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    // obtiene todos los carros de un usuario
    getOwnedVehicles(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/clientVehicle/owned`);
    }

    // obtiene un vehiculo por su placa
    searchByPlate(plate: String): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/vehicleByPlate/${plate}`);
    }

    //crea un vehiculo relacionado a un cliente asociado
    createVehicle(vehicleObject: any): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}/vehicle`, vehicleObject);
    }

    //linkea un vehiculo a un cliente particular
    linkVehicle(vehicleId: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/clientVehicle/${vehicleId}`, {});
    }


}
