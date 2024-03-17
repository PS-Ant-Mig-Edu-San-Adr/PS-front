import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, Group, Member, Organization } from '../interfaces/interface';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private httpClient: HttpClient) {}

  async getGroup(organizationId: string, activityId: string, groupName: string): Promise<Group | null> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/groups?organizationId=${organizationId}&activityId=${activityId}&name=${groupName}`).toPromise();
      if (response.status === 200) {
        const grupo: Group = response.group;
        return grupo;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el grupo:', error);
      return null;
    }
  }

  async deleteGroup(organizationId: string, activityId: string, groupName: string): Promise<boolean> {
    try {
      const response: any = await this.httpClient.delete(`http://localhost:3001/api/groups?organizationId=${organizationId}&activityId=${activityId}&name=${groupName}`).toPromise();
      return response.status === 200;
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
      return false;
    }
  }

  putGroup(description: string, schedules:any, name: string, organizationId: string, activityId: string, groupId: string): Observable<any> {

    const body = {
      name: name,
      description: description,
      schedules: schedules
    }
    return this.httpClient.put(`http://localhost:3001/api/groups/${organizationId}/${activityId}/${groupId}`, body).pipe(
      map((res: any) => {
        console.log(res);
        return res;

      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de modificar la organización:', error);
        return of(undefined);
      })
    );
  }

  putGroupMembers(organizationId: string, activityId: string, groupId: string, body: any): Observable<any> {

    return this.httpClient.put(`http://localhost:3001/api/groups/${organizationId}/${activityId}/${groupId}`, body).pipe(
      map((res: any) => {
        console.log(res);
        return res;

      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de modificar la organización:', error);
        return of(undefined);
      })
    );
  }

  postGroup(organizationId: string, activityId: string, name: string, description: string, privacy: string, members: Array<Member>): Observable<any> {
      const body = {
        name: name,
        description: description,
        members: members,
        privacy: privacy,
      }
      return this.httpClient.post<any>(`http://localhost:3001/api/groups/${organizationId}/${activityId}`, body).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => {
          console.error('Error al realizar la solicitud de añadir la organización:', error);
          return of(undefined);
        })
      );
    }


  getGroupsByUsername(username: any): Observable<Group[]> {
    return this.httpClient.get(`http://localhost:3001/api/groups/${username}`).pipe(
      map((res: any) => {
        if (res && res.success && res.groups) {
          return res.groups.map((group: any) => {
            return {
              parentOrganization: group.parentOrganization,
              parentActivity: group.parentActivity,
              _id: group._id,
              name: group.name,
              description: group.description,
              members: group.members,
              events: group.events,
              privacy: group.privacy,
              schedules: group.schedules
            };
          });
        } else {
          // Si no se encontraron actividades, devolver un array vacío
          return [];
        }
      })
    );
  }


}
