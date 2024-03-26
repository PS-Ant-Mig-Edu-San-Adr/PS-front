import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recordatorio} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  constructor(private httpClient: HttpClient) {}

  async getRecordatorios(_id: string): Promise<Recordatorio[]> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/users/${_id}/reminders`).toPromise();
      if (response.success) {
        return response.result.map((reminder: Recordatorio) => ({
          _id: reminder._id,
          title: reminder.title,
          start_date: new Date(reminder.start_date),
          end_date: new Date(reminder.end_date),
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

  async deleteRecordatorio(id: string): Promise<boolean> {
    try {
      const response: any = await this.httpClient.delete(`http://localhost:3001/api/reminders/${id}`).toPromise();
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
