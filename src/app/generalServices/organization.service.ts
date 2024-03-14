import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las organizaciones
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizaciones`);
  }

  // Método para obtener una organización por su ID
  getOrganizationById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organizaciones/${id}`);
  }

  // Método para obtener organizaciones por nombre de usuario
  getOrganizationsByUsername(username: string): Observable<{organizations: Organization[]}> {
    return this.http.get<{organizations: Organization[]}>(`${this.apiUrl}/organizaciones/${username}`);
  }

}
