import { CommonModule } from '@angular/common';
import { OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Component } from '@angular/core';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { SessionStorageService } from 'angular-web-storage';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Recordatorio } from '../interfaces/interface';

@Component({
  selector: 'app-add-reminder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent implements OnInit, OnDestroy{
  constructor(private addReminderService: AddReminderService, private sessionStorageService: SessionStorageService) {}
  @Input() recordatorio: Recordatorio | null = null;


  selectedDateStart: string = '';
  selectedDateEnd: string = '';
  selectedRepeat: string = '';
  selectedTitle: string = '';
  selectedColor: string = '';
  selectedDescription: string = '';
  private locale: string = 'en-US';
  private dateSubscription: Subscription = new Subscription();

  async ngOnInit(): Promise<void> {

    this.dateSubscription = this.addReminderService.date$.subscribe(date => {
      if (date) {
        this.selectedDateStart = this.formatDateToDateTimeLocal(date);
        this.selectedDateEnd = this.formatDateToDateTimeLocal(date);
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recordatorio'] && this.recordatorio) {
      this.loadReminderData(this.recordatorio);
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


  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  formatDateToDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-ddTHH:mm', this.locale);
  }


  closeAddReminderPopup() {
    this.addReminderService.closeAddReminderPopup();

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

  updateReminder() {
    if (this.checkContent()) {
      const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
      const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;
      const selectedRepeat = document.getElementById('input-repeat') as HTMLInputElement;
      const selectedTitle = document.getElementById('input-title') as HTMLInputElement;
      const selectedColor = document.getElementById('input-color') as HTMLInputElement;
      const selectedDescription = document.getElementById('input-description') as HTMLInputElement;

      
      if(selectedDateStart.value > selectedDateEnd.value){
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
        return;
      }else if(selectedDateStart.value === selectedDateEnd.value){
        alert('La fecha de inicio no puede ser igual a la fecha de fin');
        return;
      }else if(selectedDateStart.value < formatDate(new Date(), 'yyyy-MM-ddTHH:mm', this.locale)){
        alert('La fecha de inicio no puede ser menor que la fecha actual');
        return;
      }
  
      this.addReminderService.updateReminder(
        selectedDateStart.value,
        selectedDateEnd.value,
        selectedRepeat.value,
        selectedTitle.value,
        selectedColor.value,
        selectedDescription?.value || '',
        this.sessionStorageService.get('username'),
        this.recordatorio?.id || ''
      );
      this.closeAddReminderPopup();
    } else {
      alert('Please fill all the fields');
    }
  }

  addReminder() {
    if (this.checkContent() && this.sessionStorageService.get('username')) {
      const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
      const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;
      const selectedRepeat = document.getElementById('input-repeat') as HTMLInputElement;
      const selectedTitle = document.getElementById('input-title') as HTMLInputElement;
      const selectedColor = document.getElementById('input-color') as HTMLInputElement;
      const selectedDescription = document.getElementById('input-description') as HTMLInputElement;

      
      if(selectedDateStart.value > selectedDateEnd.value){
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
        return;
      }else if(selectedDateStart.value === selectedDateEnd.value){
        alert('La fecha de inicio no puede ser igual a la fecha de fin');
        return;
      }else if(selectedDateStart.value < formatDate(new Date(), 'yyyy-MM-ddTHH:mm', this.locale)){
        alert('La fecha de inicio no puede ser menor que la fecha actual');
        return;
      }

      this.addReminderService.addReminder(
        selectedDateStart.value,
        selectedDateEnd.value,
        selectedRepeat.value,
        selectedTitle.value,
        selectedColor.value,
        selectedDescription?.value || '',
        this.sessionStorageService.get('username')
      );
      this.closeAddReminderPopup();
    } else {
      alert('Please fill all the fields');
    }
  }

}
