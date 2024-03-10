import { CommonModule } from '@angular/common';
import { OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { LocalStorageService } from 'angular-web-storage';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-reminder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent implements OnInit, OnDestroy{
  constructor(private addReminderService: AddReminderService, private localStorageService: LocalStorageService) {}

  selectedDateStart: string = '';
  private locale: string = 'en-US';
  private dateSubscription: Subscription = new Subscription();

  async ngOnInit(): Promise<void> {

    this.dateSubscription = this.addReminderService.date$.subscribe(date => {
      if (date) {
        this.selectedDateStart = this.formatDateToDateTimeLocal(date);
      }
    });

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

  addReminder() {
    if (this.checkContent() && this.localStorageService.get('username')) {
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
        this.localStorageService.get('username')
      );
      this.closeAddReminderPopup();
    } else {
      alert('Please fill all the fields');
    }
  }
  
}
