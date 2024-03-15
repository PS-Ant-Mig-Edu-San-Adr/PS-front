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
        return response.reminders.map((reminder: Recordatorio) => ({
          _id: reminder._id,
          title: reminder.title,
          startDate: new Date(reminder.startDate),
          endDate: new Date(reminder.endDate),
          description: reminder.description,
          type: "recordatorio",
          color: reminder.color,
          repeat: reminder.repeat
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los recordatorios:', error);
      return [];
    }
  }

  async deleteRecordatorio(username: string, id: string): Promise<boolean> {
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
