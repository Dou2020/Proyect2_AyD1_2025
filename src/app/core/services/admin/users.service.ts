import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { UserModel } from '../../models/admin/user.model';

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
    return this.http.post<UserModel>(`${this.baseUrl}/users`, payload);
  }

  // Actualizar un usuario existente
  updateUser(id: number, payload: Partial<UserModel>): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/users/${id}`, payload);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
