import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private httpClient: HttpClient) {}

  async getEventos(username: string): Promise<Evento[]> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/eventos/${username}`).toPromise();
      if (response.status === 200) {
        // Mapear los resultados para que cumplan con la interfaz Recordatorio
        const eventos: Evento[] = response.events.map((event: any) => ({
          id: event._id,
          titulo: event.title,
          fechaInicio: new Date(event.startDate),
          fechaFin: new Date(event.endDate),
          descripcion: event.description || '',
          tipo: "evento",
          color: event.color || '',
          repetir: event.repeat || '',
          estado: event.status || '',
          adjuntos: event.attachments || '',
          grupo: event.group || 0,
          notas: event.notes || ''
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
