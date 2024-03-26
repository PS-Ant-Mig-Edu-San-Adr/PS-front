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
        this.selectedRepeat = '';
        this.selectedTitle = '';
        this.selectedColor = '';
        this.selectedDescription = '';
        this.recordatorio = null;
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recordatorio'] && this.recordatorio) {
      this.loadReminderData(this.recordatorio);
    }
  }

  loadReminderData(reminder: Recordatorio) {
    this.selectedDateStart = this.formatDateToDateTimeLocal(reminder.start_date.toString());
    this.selectedDateEnd = this.formatDateToDateTimeLocal(reminder.end_date.toString());
    this.selectedRepeat = reminder.repeat ?? 'ninguno';
    this.selectedTitle = reminder.title;
    this.selectedColor = reminder.color ?? 'red';
    this.selectedDescription = reminder.description ?? '';

  }


  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  formatDateToDateTimeLocal(dateString: string): string {
    console.log(dateString);
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
      alert('Please fill all the fields');
      return false;
    }
  }

  getWeek(date: Date) {
    let tempDate: Date = new Date(date.getTime());
  
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() - (tempDate.getDay() === 0 ? 6 : tempDate.getDay() - 1));
  
    let firstMonday: Date = new Date(tempDate.getFullYear(), 0, 1);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }
  
    let difference = tempDate.getTime() - firstMonday.getTime();

    return Math.ceil(difference / (7 * 24 * 60 * 60 * 1000)) + 1;
  }
  

  checkDate(): boolean{
    const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
    const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;

       
    if (this.selectedRepeat === 'diario') {
      const startDay = new Date(selectedDateStart.value).getDate();
      const endDay = new Date(selectedDateEnd.value).getDate();
      if (startDay !== endDay) {
        alert('Las fechas deben estar en el mismo día si el recordatorio es diario');
        return false;
      }
    } else if (this.selectedRepeat === 'semanal') {
      const startWeek = this.getWeek(new Date(selectedDateStart.value));
      const endWeek = this.getWeek(new Date(selectedDateEnd.value));
      if (startWeek !== endWeek) {
        alert('Las fechas deben estar en la misma semana si el recordatorio es semanal');
        return false;
      }
    } else if (this.selectedRepeat === 'mensual') {
      const startMonth = new Date(selectedDateStart.value).getMonth();
      const endMonth = new Date(selectedDateEnd.value).getMonth();
      if (startMonth !== endMonth) {
        alert('Las fechas deben estar en el mismo mes si el recordatorio es mensual');
        return false;
      }
    } else if (this.selectedRepeat === 'anual') {
      const startYear = new Date(selectedDateStart.value).getFullYear();
      const endYear = new Date(selectedDateEnd.value).getFullYear();
      if (startYear !== endYear) {
        alert('Las fechas deben estar en el mismo año si el recordatorio es anual');
        return false;
      }
    }

    if (selectedDateStart.value > selectedDateEnd.value) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin');
      return false;
    } else if (selectedDateStart.value === selectedDateEnd.value) {
      alert('La fecha de inicio no puede ser igual a la fecha de fin');
      return false;
    } else if (selectedDateStart.value < formatDate(new Date(), 'yyyy-MM-ddTHH:mm', this.locale)) {
      alert('La fecha de inicio no puede ser menor que la fecha actual');
      return false;
    }

    return true;

  }


  updateReminder() {
    if (this.checkContent() && this.checkDate() && this.sessionStorageService.get('id')){
      const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
      const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;
      const selectedRepeat = document.getElementById('input-repeat') as HTMLInputElement;
      const selectedTitle = document.getElementById('input-title') as HTMLInputElement;
      const selectedColor = document.getElementById('input-color') as HTMLInputElement;
      const selectedDescription = document.getElementById('input-description') as HTMLInputElement;
  
      this.addReminderService.updateReminder(
        selectedDateStart.value,
        selectedDateEnd.value,
        selectedRepeat.value,
        selectedTitle.value,
        selectedColor.value,
        selectedDescription?.value || '',
        this.sessionStorageService.get('id')
      );
      this.closeAddReminderPopup();
    }
  }

  addReminder() {
    if (this.checkContent() && this.sessionStorageService.get('id') && this.checkDate()) {
      const selectedDateStart = document.getElementById('input-start-date') as HTMLInputElement;
      const selectedDateEnd = document.getElementById('input-end-date') as HTMLInputElement;
      const selectedRepeat = document.getElementById('input-repeat') as HTMLInputElement;
      const selectedTitle = document.getElementById('input-title') as HTMLInputElement;
      const selectedColor = document.getElementById('input-color') as HTMLInputElement;
      const selectedDescription = document.getElementById('input-description') as HTMLInputElement;

      this.addReminderService.addReminder(
        selectedDateStart.value,
        selectedDateEnd.value,
        selectedRepeat.value,
        selectedTitle.value,
        selectedColor.value,
        selectedDescription?.value || '',
        this.sessionStorageService.get('id')
      );
      this.closeAddReminderPopup();
    } else {
      alert('Please fill all the fields');
    }
  }

}



