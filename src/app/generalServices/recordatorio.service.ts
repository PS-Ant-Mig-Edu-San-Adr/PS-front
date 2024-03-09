import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recordatorio } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  constructor(private httpClient: HttpClient) {}

  async getRecordatorios(username: string): Promise<Recordatorio[]> {
    try {
      const response: any = await this.httpClient.get(`http://localhost:3001/api/recordatorios/${username}`).toPromise();
      if (response.status === 200) {
        // Mapear los resultados para que cumplan con la interfaz Recordatorio
        const recordatorios: Recordatorio[] = response.recordatorios.map((recordatorio: any) => ({
          id: recordatorio.id,
          titulo: recordatorio.titulo,
          fechaInicio: new Date(recordatorio.fechaInicio),
          fechaFin: new Date(recordatorio.fechaFin),
          descripcion: recordatorio.descripcion || '',
          tipo: "recordatorio",
          color: recordatorio.color || '',
          repetir: recordatorio.repetir || ''
        }));
        return recordatorios;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los recordatorios:', error);
      return [];
    }
  }
}
