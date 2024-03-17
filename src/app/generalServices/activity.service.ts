import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, map, of} from 'rxjs';
import {Activity, Member} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {
  }

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

  addMember(activity_id: string, member: Member): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/actividades/${activity_id}/addMember/${member.username}`, member).pipe(
      catchError((error) => {
        console.error('Error al agregar el miembro:', error);
        throw new Error('Error al agregar el miembro');
      })
    );
  }

  removeMember(activity_id: string, member: Member): Observable<any> {

    return this.http.delete<any>(`${this.apiUrl}/actividades/${activity_id}/removeMember/${member.username}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el miembro:', error);
        throw new Error('Error al agregar el miembro');
      })
    );
  }

  updateMembersActivity(organizationId: string, activityId: string, body: any): Observable<any> {

    return this.http.put<any>(`${this.apiUrl}/activities/${organizationId}/${activityId}`, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de añadir la organización:', error);
        return of(undefined);
      })
    );

  }

  getActivitiesByUsername(username: any): Observable<Activity[]> {
    return this.http.get<any>(`${this.apiUrl}/activities/${username}`).pipe(
      map((response: any) => {
        if (response && response.success && response.activities) {
          // Mapear la respuesta a un array de Activity
          return response.activities.map((activity: any) => ({
            _id: activity._id,
            parentOrganization: activity.parentOrganization,
            name: activity.name,
            description: activity.description,
            groups: activity.groups,
            members: activity.members,
            privacy: activity.privacy
          }));
        } else {
          // Si no se encontraron actividades, devolver un array vacío
          return [];
        }
      })
    );
  }

  getActivityById(organizationId: string, activityId: string): Observable<Activity> {
    return this.http.get<any>(`${this.apiUrl}/activities/${organizationId}/${activityId}`).pipe(
      map((response: any) => {
        if (response && response.success && response.activity) {
          return response.activity;
        } else {
          return undefined;
        }
      })
    );
  }

}
