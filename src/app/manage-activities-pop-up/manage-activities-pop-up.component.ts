import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageActivitiesPopUpService } from './manage-activities-pop-up.service';

@Component({
  selector: 'app-manage-activities-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-activities-pop-up.component.html',
  styleUrl: './manage-activities-pop-up.component.css'
})
export class ManageActivitiesPopUpComponent {
  constructor(private addActivitiesService: ManageActivitiesPopUpService) {}

  closeAddActivityPopup() {
    this.addActivitiesService.closeAddActivityPopup();
  }
}