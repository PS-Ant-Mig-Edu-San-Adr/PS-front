import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { Organization } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AdminActivitiesService {

  organizations: Organization[] = [];
  constructor(private http: HttpClient) { }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>('http://localhost:3001/api/organizations')
      .pipe(
        tap((data: Organization[]) => {
          // Almacena los datos devueltos en el array de organizaciones
          this.organizations = data;
        }),
        catchError(error => {
          console.error('Error al recuperar las organizaciones:', error);
          throw error;
        })
      );
  }
  
}