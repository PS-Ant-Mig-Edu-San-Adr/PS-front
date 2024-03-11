import { Injectable } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service';
import { ManageActivitiesPopUpService } from '../manage-activities-pop-up/manage-activities-pop-up.service';
import { GroupAddPopUpService } from '../group-add-pop-up/group-add-pop-up.service';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { EventDetailsService } from '../event-details/event-details.component.service';
@Injectable({
  providedIn: 'root',
})
export class SharedPopupsService {
  constructor
  (private renderer: Renderer2, 
    private el: ElementRef, 
    public loginService: LoginService, 
    public registerService: RegisterService, 
    public manageMembersService : ManageMembersService, 
    public addReminderService: AddReminderService,
    public eventDetailsService: EventDetailsService,
    public addActivitiesService: ManageActivitiesPopUpService,
    public addGroup: GroupAddPopUpService) {}

  toggleWrapperContainerStyles(success: boolean): void {
    const wrapperContainer = this.el.nativeElement.querySelector('#wrapper-container');

    if (wrapperContainer) {
      if (!success) {
        this.renderer.setStyle(wrapperContainer, 'filter', 'none');
        this.renderer.setStyle(wrapperContainer, 'pointer-events', 'auto');
      } else {
        this.renderer.setStyle(wrapperContainer, 'filter', 'blur(5px)');
        this.renderer.setStyle(wrapperContainer, 'pointer-events', 'none');
      }
    }
  }
}