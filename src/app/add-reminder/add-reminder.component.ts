import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-add-reminder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent {
  constructor(private addReminderService: AddReminderService, private sessionStorageService: SessionStorageService) {}

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
    if (this.checkContent() && this.sessionStorageService.get('username')) {
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
        this.sessionStorageService.get('username')
      );
      this.closeAddReminderPopup();
    } else {
      alert('Please fill all the fields');
    }
  }

}
