import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroments';
import { UserModel } from '../../models/admin/user.model';
import { AppUser } from '../../models/public/appUser';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Update user profile
  updateProfile(userId: string, userData: Partial<AppUser>): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/user/users/${userId}`, userData);
  }
}
