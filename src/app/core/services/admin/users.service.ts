import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { UserModel, CommerceCreateModel, UserUpdateModel } from '../../models/admin/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  // Obtener todos los usuarios
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/user/users/all`);
  }

  // Registrar un nuevo usuario
  registerUser(payload: Partial<UserModel>): Observable<UserModel> {
    console.log('Registering user with payload:', payload);
    return this.http.post<UserModel>(`${this.baseUrl}/user/register/client`, payload);
  }
  // Registrar un nuevo comercio
  registerCommerce(payload: CommerceCreateModel): Observable<UserModel> {
    console.log('Registering commerce with payload:', payload);
    return this.http.post<UserModel>(`${this.baseUrl}/commerce`, payload);
  }

  // Actualizar un usuario existente
  updateUser(id: number, payload: Partial<UserUpdateModel>): Observable<UserModel> {
    console.log('Updating user with ID:', id, 'Payload:', payload);
    return this.http.put<UserModel>(`${this.baseUrl}/user/users/${id}`, payload);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
