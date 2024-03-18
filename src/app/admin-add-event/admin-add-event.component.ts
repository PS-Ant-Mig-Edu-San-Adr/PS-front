// adminAddEvent.component.ts
import {Component, Input, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AdminButtonsComponent} from '../admin-buttons/admin-buttons.component';
import {AdminEventDataCollector} from './admin-add-event-data-collector';
import {HttpClient} from "@angular/common/http";
import {SessionStorageService} from "angular-web-storage";
import {AuthService} from "../generalServices/auth-service/auth.service";
import {FormsModule} from '@angular/forms';
import {Activity, Group, Organization} from "../interfaces/interface";
import {OrganizationService} from "../generalServices/organization.service";
import {EventosService} from "../generalServices/eventos.service";

@Component({
  selector: 'app-admin-add-event',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-add-event.component.html',
  styleUrl: './admin-add-event.component.css'
})


export class AdminAddEventComponent implements OnInit {

  constructor(public sharedService: SharedPopupsService,
              public authService: AuthService,
              private httpClient: HttpClient,
              private organizationService: OrganizationService,
              private eventsService: EventosService,
              private sessionStorageService: SessionStorageService) {
  }

  @Input() fileName: string = '';

  organizations: Organization[] = [];
  activities: Activity[] = [];
  groups: Group[] = [];
  selectedOrganization: Organization | undefined = undefined;
  selectedActivity: Activity | undefined = undefined;
  selectedGroup: Group | undefined = undefined;
  active: number = 0;
  selectedGroupsData: Group[] = [];

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.getData();
  }

  getData() {
    this.organizationService.getOrganizationsByUsername(this.sessionStorageService.get("username")).subscribe(data => {
      this.organizations = data.organizations;
      this.activities = this.organizations[0].activities;
      this.groups = this.activities[0].groups;

      this.selectedOrganization = this.organizations[0];
      this.selectedActivity = this.activities[0];
      this.selectedGroup = this.groups[0];
    });
  }

  loadActivity(selectElement: HTMLSelectElement) {
    const selectedIndex_org = selectElement.selectedIndex;
    const selectedOrg = this.organizations[selectedIndex_org];

    this.selectedOrganization = selectedOrg;

    this.activities = this.selectedOrganization.activities;
    this.selectedActivity = this.activities[0];

    if (this.selectedActivity) {
      this.groups = this.selectedActivity.groups;
      this.selectedGroup = this.groups[0];
    } else {
      this.groups = [];
      this.selectedGroup = undefined;
    }
  }

  loadGroup(selectElement: HTMLSelectElement) {
    const selectedIndex_act = selectElement.selectedIndex;
    const selectedAct = this.activities[selectedIndex_act];

    this.selectedActivity = selectedAct;

    this.groups = this.selectedActivity.groups;
    this.selectedGroup = this.groups[0];
  }

  loadGroupInfo(selectElement: HTMLSelectElement){
    const selectedGroupName = selectElement.value;
    const selectedGroup = this.groups.find((group: Group) => group.name === selectedGroupName);
    if (selectedGroup) {
      this.selectedGroup = selectedGroup;
    }
  }


  onSendClick(): void {

    const eventData = AdminEventDataCollector.collectEventData();


    if (!eventData.result) {
      alert(eventData.details);
      return;
    }

    const username = this.sessionStorageService.get('username');
    if (!username) {
      alert('Please log in before adding an event.');
      return;
    }


    this.eventsService.addEvent(eventData.result, this.selectedGroupsData).then((success: boolean) => {
      if (success) {
        alert('Event successfully added.');
      } else {
        alert('Error adding event. Please try again later.');
      }
    });
  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files[0];
      if (this.isValidFileType(file)) {
        this.fileName = file.name;
      } else {
        this.fileName = '';
        alert('El archivo seleccionado no es un PDF ni un archivo DOCX.');
      }
    } else {
      this.fileName = '';
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  }

  onAddGroupClick() {

    if (!this.selectedGroup || !this.selectedOrganization || !this.selectedActivity) {
      alert('Por favor, seleccione una organización, una actividad y un grupo antes de añadirlo.');
      return;
    }

    const addedGroupsInput = document.getElementById('added-groups') as HTMLInputElement;

    const OrganizationName = this.selectedOrganization.name;
    const activityName = this.selectedActivity.name;
    const groupName = this.selectedGroup.name;

    if (addedGroupsInput.value.includes(OrganizationName + '_' + activityName + '_' + groupName)) {
      alert('El grupo seleccionado ya ha sido añadido.');
      return;
    }

    this.selectedGroupsData.push(this.selectedGroup);

    if (addedGroupsInput.value) {
      addedGroupsInput.value += ", " + OrganizationName + '_' + activityName + '_' + groupName;
    } else {
      addedGroupsInput.value = OrganizationName + '_' + activityName + '_' + groupName;
    }

  }

}
