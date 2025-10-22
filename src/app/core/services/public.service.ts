import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../enviroments/enviroments';
import { AppUser } from '../models/public/appUser';

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

  twoFactorAuth( credencials:{username: string, code: string}): Observable<{token: string}>{
    return this.http.post<{token: string}>(`${this.baseUrl}/login/mfa`, credencials);
  }

  // Metodo de Login
  login(credentials: { username: string; password: string }): Observable<{user: AppUser; token: string}> {
    return this.http.post<{ user: AppUser; token: string }>(`${this.baseUrl}/login`, credentials);
  }

  recoveryPassword(credentials: {username: string; code: string; password: string}){
    return this.http.post(`${this.baseUrl}/user/password-recovery`, credentials);
  }

}
