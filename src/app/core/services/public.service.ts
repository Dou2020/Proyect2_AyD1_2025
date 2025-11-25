import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../enviroments/enviroments';
import { AppUser } from '../models/public/appUser';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Metodo de registro
  registerUser(payload: RegisterModel): Observable<any> {
    console.log('Registering user with payload:', payload);
    return this.http.post(`${this.baseUrl}/user/register/client`, payload);
  }

  // reenvio de codigo de verificacion
  resendVerificationCode(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-code`, { username });
  }

  // Metodo de 2FA
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
