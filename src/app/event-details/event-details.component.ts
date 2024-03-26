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
    this.selectedDateStart = this.formatDateToDateTimeLocal(reminder.start_date.toString(), reminder.end_date.toString(), reminder.repeat).inicio;
    this.selectedDateEnd = this.formatDateToDateTimeLocal(reminder.end_date.toString(), reminder.end_date.toString(), reminder.repeat).fin;
    this.selectedRepeat = reminder.repeat ?? 'ninguno';
    this.selectedTitle = reminder.title;
    this.selectedColor = reminder.color ?? 'red';
    this.selectedDescription = reminder.description ?? '';

  }

  loadEventData(event: Evento) {
    this.selectedDateStart = this.formatDateToDateTimeLocal(event.start_date.toString(), event.end_date.toString(), event.repeat).inicio;
    console.log(this.selectedDateStart);
    this.selectedDateEnd = this.formatDateToDateTimeLocal(event.end_date.toString(), event.start_date.toString(), event.repeat).fin;
    this.selectedRepeat = event.repeat ?? 'ninguno';
    this.selectedTitle = event.title;
    this.selectedColor = event.color ?? 'red';
    this.selectedDescription = event.description ?? '';
    this.eventStatus = event.status ?? 'Activo';
    this.attachmentUrl = event.attachments ?? '';
    this.eventGroup = event.group ?? 0;
    this.additionalNotes = event.notes ?? '';
  }


  formatDateToDateTimeLocal(start_date: string, end_date: string, repetir: string | undefined) : { inicio: string, fin: string } {
    const start = new Date(start_date);
    const end = new Date(end_date);

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
        case 'ninguno':
            break;
        case 'diario':
            inicio = `Diariamente desde las ${hourStart}:${minuteStart}`;
            fin = `hasta las ${hourEnd}:${minuteEnd}`;
            break;
        case 'semanal':
            inicio = `semanalmente desde el ${start.toLocaleString('es-ES', { weekday: 'long' })} a las ${hourStart}:${minuteStart}`;
            fin = `hasta el ${end.toLocaleString('es-ES', { weekday: 'long' })} a las ${hourEnd}:${minuteEnd}`;
            break;
        case 'mensual':
            inicio = `mensualmente desde el día ${dayStart} a las ${hourStart}:${minuteStart}`;
            fin = `hasta el día ${dayEnd} a las ${hourEnd}:${minuteEnd}`;
            break;
        case 'anual':
            inicio = `anualmente desde el ${dayStart} de ${monthStart} a las ${hourStart}:${minuteStart}`;
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
