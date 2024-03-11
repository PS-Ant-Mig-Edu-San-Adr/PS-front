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
  @Input() detalles: Recordatorio | null | Evento = null;


  selectedDateStart: string = '';
  selectedDateEnd: string = '';
  selectedRepeat: string = '';
  selectedTitle: string = '';
  selectedColor: string = '';
  selectedDescription: string = '';
  private locale: string = 'en-US';
  private dateSubscription: Subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['detalles'] && this.detalles) {
      this.loadReminderData(this.detalles);
    }
  }

  loadReminderData(reminder: Recordatorio) {
    this.selectedDateStart = this.formatDateToDateTimeLocal(reminder.fechaInicio.toString());
    this.selectedDateEnd = this.formatDateToDateTimeLocal(reminder.fechaFin.toString());
    this.selectedRepeat = reminder.repetir ?? 'Ninguno';
    this.selectedTitle = reminder.titulo;
    this.selectedColor = reminder.color ?? 'red';
    this.selectedDescription = reminder.descripcion ?? '';

  }


  formatDateToDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-ddTHH:mm', this.locale);
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
