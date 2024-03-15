import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, Group, Organization } from '../interfaces/interface';
import { Observable } from 'rxjs';

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
  
  async putGroup(group: Group, organizationId: string, activityId: string): Promise<boolean> {
    try {
      const body = {
        name: group.name,
        description: group.description,
        members: group.members,
        events: group.events,
        privacy: group.privacy,
        schedules: group.schedules,
        organizationId: organizationId,
        activityId: activityId
      }
      const response: any = await this.httpClient.put(`http://localhost:3001/api/groups`, body).toPromise();
      return response.status === 200;
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
      return false;
    }
  }

  async postGroup(group: Group, organizationId: string, activityId: string): Promise<boolean> {
    try {
      const body = {
        name: group.name,
        description: group.description,
        members: group.members,
        events: group.events,
        privacy: group.privacy,
        schedules: group.schedules,
        organizationId: organizationId,
        activityId: activityId
      }
      const response: any = await this.httpClient.post(`http://localhost:3001/api/groups`, body ).toPromise();
      return response.status === 200;
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      return false;
    }
  }

}
