import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recordatorio} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  constructor(private httpClient: HttpClient) {}

  async getRecordatorios(username: string): Promise<Recordatorio[]> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/recordatorios/${username}`).toPromise();
      if (response.status === 200) {
        return response.reminders.map((reminder: any) => ({
          titulo: reminder.title,
          fechaInicio: new Date(reminder.startDate),
          fechaFin: new Date(reminder.endDate),
          descripcion: reminder.description,
          tipo: "recordatorio",
          color: reminder.color || '',
          repetir: reminder.repeat || ''
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los recordatorios:', error);
      return [];
    }
  }

  async deleteRecordatorio(username: string, id: any): Promise<boolean> {
    try {
      const response: any = await this.httpClient.delete(`http://localhost:3001/api/recordatorios/${username}/${id}`).toPromise();
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el recordatorio:', error);
      return false;
    }
  }
}
