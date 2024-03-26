import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Evento, Group} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private httpClient: HttpClient) {
  }

  async getEventos(groupId: string): Promise<Evento[]> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/groups/${groupId}/events`).toPromise();
      if (response.status === 200) {
        const eventos: Evento[] = response.events.map((event: Evento) => ({
          _id: event._id,
          title: event.title,
          start_date: new Date(event.start_date),
          end_date: new Date(event.end_date),
          description: event.description,
          location: event.location,
          type: "evento",
          color: event.color,
          repeat: event.repeat,
          notes: event.notes,
          status: event.status,
          attachments: event.attachments,
          group: event.group
        }));

        return eventos;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los recordatorios:', error);
      return [];
    }
  }

  // Método para agregar un evento con sus datos y un array de grupos
  async addEvent(eventData: any, groups: Group[]): Promise<boolean> {
    try {

      // Luego, para cada grupo en el array de grupos, realizamos una solicitud para asociar el evento con el grupo
      for (const group of groups) {
        // Realizamos una solicitud para asociar el evento con el grupo actual
        const addEventToGroupResponse: any = await this.httpClient.post(`http://localhost:3001/api/eventos/grupo/${group._id}`, eventData).toPromise();

        console.log("addEventToGroupResponse", addEventToGroupResponse);
        // Verificamos si la solicitud para asociar el evento con el grupo fue exitosa
        if (!addEventToGroupResponse.success) {
          // Si no fue exitosa, mostramos un mensaje de error y retornamos false
          console.error('Error al asociar el evento con el grupo:', addEventToGroupResponse.message);
          return false;
        }
      }
        // Si todas las asociaciones con grupos fueron exitosas, retornamos true
        return true;
    } catch (error) {
      // Si se produce un error durante el proceso, mostramos un mensaje de error y retornamos false
      console.error('Error al agregar el evento:', error);
      return false;
    }
  }

  async deleteEvento(username: string, id: any): Promise<boolean> {
    try {
      const response: any = await this.httpClient.delete(`http://localhost:3001/api/eventos/${username}/${id}`).toPromise();
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      return false;
    }
  }
}
