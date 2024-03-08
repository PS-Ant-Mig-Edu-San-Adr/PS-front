import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'URL_DEL_API'; // Aquí debes colocar la URL de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener todas las actividades
  // getActivities(): Observable<Activity[]> {
  //   return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
  // }

  getActivities(): any {
    return null;
  }

  // Método para obtener las actividades de una organización por su ID
  // getActivitiesByOrganizationId(organizationId: number): Observable<Activity[]> {
  //   return this.http.get<Activity[]>(`${this.apiUrl}/organizations/${organizationId}/activities`);
  // }

  getActivitiesByOrganizationId(organizationId: number): any {
    return null;
  }

}
