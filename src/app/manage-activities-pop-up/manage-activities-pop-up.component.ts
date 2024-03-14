import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageActivitiesPopUpService } from './manage-activities-pop-up.service';
import { Organization, User } from '../interfaces/interface';
import { ActivityService } from '../generalServices/activity.service';

@Component({
  selector: 'app-manage-activities-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-activities-pop-up.component.html',
  styleUrl: './manage-activities-pop-up.component.css'
})
export class ManageActivitiesPopUpComponent {
  constructor(private addActivitiesService: ManageActivitiesPopUpService, private activityService: ActivityService) {}
  @Input() organization: Organization | undefined = undefined;
  @Input() user: User | undefined = undefined;

  @ViewChild('name') name: ElementRef | undefined;
  @ViewChild('description') description: ElementRef | undefined;
  @ViewChild('privacy') privacy: ElementRef | undefined;
  


  closeAddActivityPopup() {
    this.addActivitiesService.closeAddActivityPopup();
  }

  addActivity() {
    if (this.checkIfEmpty() && this.user) {
      if (this.checkIfNameExists()) {
        alert('Activity with this name already exists');
      } else {
        const members = this.organization?.members?.filter(member => member._id === this.user?._id) ?? [];
        this.activityService.addActivity(this.organization?._id, this.name?.nativeElement.value, this.description?.nativeElement.value, this.privacy?.nativeElement.value, members).subscribe((res) => {
          if (res) {
            if(res.status === 200){
              this.addActivitiesService.closeAddActivityPopup();
            }else{
              alert(res.details)
            }
            
          } else {
            alert('Error adding activity');
          }
        });
      }
    } else {
      alert('Please fill in all fields');
    }
  }

  checkIfNameExists() {
    if (this.organization?.activities.find(activity => activity.name === this.name?.nativeElement.value)) {
      return true;
    }
    return false;
  }
  
  checkIfEmpty() {
    if (this.name?.nativeElement.value && this.description?.nativeElement.value && this.privacy?.nativeElement.value) {
      return true;
    }
    return false;
  }
}