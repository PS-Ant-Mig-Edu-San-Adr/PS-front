import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Organization } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las organizaciones
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<{ organizations: Organization[] }>(`${this.apiUrl}/organizaciones`)
      .pipe(
        map(response => response.organizations),
        catchError(error => {
          console.error('Error al obtener las organizaciones:', error);
          return of([]); // Devolver un array vacío en caso de error
        })
      );
  }

  // Método para obtener una organización por su ID
  getOrganizationById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organizaciones/${id}`);
  }

  // Método para obtener una o más organizaciones por su nombre
  getOrganizationsByName(name: string): Observable<Organization[]> {
    return this.http.get<{ organizations: Organization[] }>(`${this.apiUrl}/organizaciones/byName/${name}`)
      .pipe(
        map(response => response.organizations),
        catchError(error => {
          console.error('Error al obtener las organizaciones:', error);
          return of([]); // Devolver un array vacío en caso de error
        })
      );
  }

  // Método para obtener organizaciones por nombre de usuario
  getOrganizationsByUsername(username: string): Observable<{organizations: Organization[]}> {
    return this.http.get<{organizations: Organization[]}>(`${this.apiUrl}/organizaciones/${username}`);
  }

  createOrganization(
    username: String,
    name: string,
    description: string,
    email: string,
    domain: string,
    contact: string,
    privacy: string
  ): Observable<any> {

    const body = {
      name,
      description,
      email,
      domain,
      contact,
      privacy
    };

    return this.http.post<any>(`${this.apiUrl}/organizaciones/${username}`, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de añadir la organización:', error);
        return of(undefined);
      })
    );
  }

  putOrganization(
    organization: Organization,
    body: any
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/organizaciones/${organization._id}`, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de actualizar la organización:', error);
        return of(undefined);
      })
    );
  }

}
