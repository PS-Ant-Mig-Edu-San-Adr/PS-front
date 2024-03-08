import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';

@Component({
  selector: 'app-add-reminder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent {
  constructor(private addReminderService: AddReminderService) {}

  closeAddReminderPopup() {
    this.addReminderService.closeAddReminderPopup();
  }
}
