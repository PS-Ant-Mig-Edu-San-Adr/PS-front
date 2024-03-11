import { CommonModule } from '@angular/common';
import { Input, SimpleChanges, OnChanges } from '@angular/core';
import { Component } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Recordatorio, Evento } from '../interfaces/interface';
import { EventDetailsService } from '../event-details/event-details.component.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnChanges{
  constructor(private eventDetailsService: EventDetailsService, private sessionStorageService: SessionStorageService) {}
  @Input() detalles: (Recordatorio | null | Evento) = null;

  selectedDateStart: string = '';
  selectedDateEnd: string = '';
  selectedRepeat: string = '';
  selectedTitle: string = '';
  selectedColor: string = '';
  selectedDescription: string = '';
  eventStatus: string = 'Activo';
  attachmentUrl: string = '';
  eventGroup: number = 0;
  additionalNotes: string = '';
  private locale: string = 'en-US';
  private dateSubscription: Subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges) {
    const detallesActual = changes['detalles'].currentValue;
    
    if(detallesActual){
      if(detallesActual.tipo === 'evento'){
        this.loadEventData(detallesActual); 
      } else {
        this.loadReminderData(detallesActual);
      }
    }
  }

  loadReminderData(reminder: Recordatorio) {
    this.selectedDateStart = this.formatDateToDateTimeLocal(reminder.fechaInicio.toString(), reminder.fechaFin.toString(), reminder.repetir).inicio;
    this.selectedDateEnd = this.formatDateToDateTimeLocal(reminder.fechaFin.toString(), reminder.fechaFin.toString(), reminder.repetir).fin;
    this.selectedRepeat = reminder.repetir ?? 'Ninguno';
    this.selectedTitle = reminder.titulo;
    this.selectedColor = reminder.color ?? 'red';
    this.selectedDescription = reminder.descripcion ?? '';

  }

  loadEventData(event: Evento) {
    this.selectedDateStart = this.formatDateToDateTimeLocal(event.fechaInicio.toString(), event.fechaFin.toString(), event.repetir).inicio;
    console.log(this.selectedDateStart);
    this.selectedDateEnd = this.formatDateToDateTimeLocal(event.fechaFin.toString(), event.fechaFin.toString(), event.repetir).fin;
    this.selectedRepeat = event.repetir ?? 'Ninguno';
    this.selectedTitle = event.titulo;
    this.selectedColor = event.color ?? 'red';
    this.selectedDescription = event.descripcion ?? '';
    this.eventStatus = event.estado ?? 'Activo';
    this.attachmentUrl = event.adjuntos ?? '';
    this.eventGroup = event.grupo ?? 0;
    this.additionalNotes = event.notas ?? '';
  }


  formatDateToDateTimeLocal(startDate: string, endDate: string, repetir: string | undefined) : { inicio: string, fin: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dayStart = start.getDate();
    const monthStart = start.toLocaleString('es-ES', { month: 'long' });
    const yearStart = start.getFullYear();
    const hourStart = start.getHours().toString().padStart(2, '0');
    const minuteStart = start.getMinutes().toString().padStart(2, '0');

    const dayEnd = end.getDate();
    const monthEnd = end.toLocaleString('es-ES', { month: 'long' });
    const yearEnd = end.getFullYear();
    const hourEnd = end.getHours().toString().padStart(2, '0');
    const minuteEnd = end.getMinutes().toString().padStart(2, '0');

    let inicio = `${dayStart} de ${monthStart} de ${yearStart} a las ${hourStart}:${minuteStart}`;
    let fin = `${dayEnd} de ${monthEnd} de ${yearEnd} a las ${hourEnd}:${minuteEnd}`;

    switch (repetir) {
        case 'Ninguno':
            break;
        case 'Diario':
            inicio = `Diariamente desde las ${hourStart}:${minuteStart}`;
            fin = `hasta las ${hourEnd}:${minuteEnd}`;
            break;
        case 'Semanal':
            inicio = `Semanalmente desde el ${start.toLocaleString('es-ES', { weekday: 'long' })} a las ${hourStart}:${minuteStart}`;
            fin = `hasta el ${end.toLocaleString('es-ES', { weekday: 'long' })} a las ${hourEnd}:${minuteEnd}`;
            break;
        case 'Mensual':
            inicio = `Mensualmente desde el día ${dayStart} a las ${hourStart}:${minuteStart}`;
            fin = `hasta el día ${dayEnd} a las ${hourEnd}:${minuteEnd}`;
            break;
        case 'Anual':
            inicio = `Anualmente desde el ${dayStart} de ${monthStart} a las ${hourStart}:${minuteStart}`;
            fin = `hasta el ${dayEnd} de ${monthEnd} a las ${hourEnd}:${minuteEnd}`;
            break;
        default:
            inicio = 'Formato de repetición no reconocido';
            fin = 'Formato de repetición no reconocido';
    }

    return { inicio, fin };
}





  closeEventDetailsPopup() {
    this.eventDetailsService.closeEventDetailsPopup();

  }



  checkContent(): boolean{
    const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
    const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;
    const selectedRepeat = document.getElementById('input-repeat') as HTMLInputElement;
    const selectedTitle = document.getElementById('input-title') as HTMLInputElement;
    const selectedColor = document.getElementById('input-color') as HTMLInputElement;

    if (
      selectedDateStart?.value &&
      selectedDateEnd?.value &&
      selectedRepeat?.value &&
      selectedTitle?.value &&
      selectedColor?.value
    ) {
      return true;
    } else {
      return false;
    }
  }

}
