import { Component, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { LoginService } from '../generalServices/auth-service/login.component.service';
import { RegisterService } from '../generalServices/auth-service/register.component.service';
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
import { Recordatorio } from '../interfaces/interface';
import { Evento } from '../interfaces/interface';
import { EventDetailsService } from '../event-details/event-details.component.service';
import { EventDetailsComponent } from '../event-details/event-details.component';
import {AuthService} from "../generalServices/auth-service/auth.service";

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, AddReminderComponent, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, CalendarComponent, EventDetailsComponent],
  providers: [SharedPopupsService, OrganizationService, ActivityService],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent implements OnInit{
  organizations: Organization[] = [];
  recordatorioParaEditar: Recordatorio | null = null;
  detalles: Recordatorio | Evento | null = null;

  constructor(
    public sharedService: SharedPopupsService,
    public authService: AuthService,
    public addReminderService: AddReminderService,
    public eventDetailsService: EventDetailsService
  ) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.addReminderService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.eventDetailsService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

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

  editReminder(event: Recordatorio) {
    this.recordatorioParaEditar = event;
    this.addReminderService.openEditReminderPopup();
  }

  showDetails(event: Recordatorio | Evento) {
    this.detalles = event;
    this.eventDetailsService.openEventDetailsPopup();
  }

  addReminder(event: any) {
    let selectedDateStart: string = '';
    const today = new Date();
    const currentDay = today.getDay();

    const adjustedCurrentDay = (currentDay === 0) ? 6 : currentDay - 1;

    if (event.type === 'mes') {
      selectedDateStart = new Date(event.ano, event.mes, event.dia).toISOString();
      this.addReminderService.openAddReminderPopup(selectedDateStart);
    } else if (event.type === 'dia') {
      const hora = event.hora.split(":")
      selectedDateStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hora[0], hora[1]).toISOString();
      this.addReminderService.openAddReminderPopup(selectedDateStart);
    } else if (event.type === 'semana') {
      const selectedWeekDay = event.dia;
      let daysDifference = selectedWeekDay - adjustedCurrentDay;

      const hora = event.hora.split(":")

      today.setDate(today.getDate() + daysDifference);
      selectedDateStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hora[0], hora[1]).toISOString();
      this.addReminderService.openAddReminderPopup(selectedDateStart);
    }
  }


}
