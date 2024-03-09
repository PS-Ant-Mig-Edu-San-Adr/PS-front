import { Component, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { OrganizationService } from '../generalServices/organization.service';
import { ActivityService } from '../generalServices/activity.service';
import { Organization } from '../interfaces/interface';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { AddReminderComponent } from '../add-reminder/add-reminder.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, AddReminderComponent, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, CalendarComponent],
  providers: [SharedPopupsService, OrganizationService, ActivityService],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent implements OnInit{
  organizations: Organization[] = [];

  constructor(
    public sharedService: SharedPopupsService, 
    public loginService: LoginService, 
    public registerService: RegisterService,
    public addReminderService: AddReminderService,
  ) {}

  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.addReminderService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.loadOrganizations();
  }

  loadOrganizations() {
    // this.organizationService.getOrganizations().subscribe((organizations: Organization[]) => {
    //   this.organizations = organizations;
    // });
    return this.organizations;
  }

  loadActivitiesForOrganization(organization: Organization) {
    // this.activityService.getActivitiesByOrganizationId(organization.id).subscribe((activities: any[]) => {
    //   organization.activities = activities;
    // });
    return organization;
  }

  addReminder(event : any) {
    this.addReminderService.openAddReminderPopup();
  }

}
