import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Metodo de registro
  registerUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  registerClient(payload: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/client/register`, payload)
  }

  // Metodo de Login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  recoveryPassword(credentials: {username: string; code: string; password: string}){
    return this.http.post(`${this.baseUrl}/user/password-recovery`, credentials);
  }

}
