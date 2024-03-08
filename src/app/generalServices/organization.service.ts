import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'URL_DEL_API'; // Aquí debes colocar la URL de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener todas las organizaciones
  // getOrganizations(): Observable<Organization[]> {
  //   return this.http.get<Organization[]>(`${this.apiUrl}/organizations`);
  // }

  getOrganizations(): any {
    return null;
  }

  // Método para obtener una organización por su ID
  // getOrganizationById(id: number): Observable<Organization> {
  //   return this.http.get<Organization>(`${this.apiUrl}/organizations/${id}`);
  // }

  getOrganizationById(id: number): any {
    return null;
  }
}
