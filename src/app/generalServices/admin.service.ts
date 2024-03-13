import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

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

    return this.httpClient.post<any>(`http://localhost:3001/api/organizaciones/${username}`, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de añadir la organización:', error);
        return of(undefined);
      })
    );
  }
}
