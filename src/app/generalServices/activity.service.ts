import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Activity, Member } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  addActivity(
    id: string,
    name: string,
    description: string,
    privacy: string,
    members: Array<Member>
  ): Observable<any> {

    const activity = {
      name,
      description,
      privacy,
      members
    };

    return this.http.post<any>(`${this.apiUrl}/activities/${id}`, activity).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de añadir la organización:', error);
        return of(undefined);
      })
    );
  }


  updateActivity(
    organizationId: string,
    activityId: string,
    name: string,
    description: string,
  ): Observable<any> {

    const activity = {
      name,
      description,
    };

    return this.http.put<any>(`${this.apiUrl}/activities/${organizationId}/${activityId}`, activity).pipe(
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
