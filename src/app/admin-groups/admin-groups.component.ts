import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AdminButtonsComponent} from '../admin-buttons/admin-buttons.component';
import {ManageMembersService} from '../manage-members-pop-up/manage-members-pop-up.component.service';
import {ManageMembersPopUpComponent} from '../manage-members-pop-up/manage-members-pop-up.component';
import {AuthService} from "../generalServices/auth-service/auth.service";
import {FormsModule} from '@angular/forms';
import {AdminGroupsDataCollector} from "./admin-groups-data-collector";
import {Activity, Group, Organization, User} from "../interfaces/interface";
import {SessionStorageService} from 'angular-web-storage';
import {GroupService} from '../generalServices/group.service';
import {OrganizationService} from '../generalServices/organization.service';
import {ActivityService} from "../generalServices/activity.service";
import {map} from "rxjs";
import {load} from "@angular-devkit/build-angular/src/utils/server-rendering/esm-in-memory-loader/loader-hooks";


interface OrganizationActivityGroupMap {
  [organizationId: string]: {
    [activityId: string]: Group[];
  };
}

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    RegisterComponent,
    AdminButtonsComponent,
    ManageMembersPopUpComponent
  ],
  providers: [SharedPopupsService],
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.css']
})
export class AdminGroupsComponent implements OnInit {

  constructor(
    public manageMembersService: ManageMembersService,
    public sharedService: SharedPopupsService,
    private sessionStorageService: SessionStorageService,
    protected authService: AuthService,
    public groupService: GroupService,
    public organizationService: OrganizationService,
    private activityService: ActivityService
  ) {
  }

  active: number = 4;
  user: User | undefined;
  originalColor: string = '';
  days: boolean[] = [false, false, false, false, false, false, false];

  rows: any[] = [
    {startTime: '', endTime: ''},
  ];

  result: any[] = this.rows.map(row => ({
    horas: {startTime: '', endTime: ''},
    dias: [...this.days]
  }));

  organizations: Organization[] = [];
  activities: Activity[] = [];
  shownActivities: Activity[] = [];
  groups: Group[] = [];
  selectedOrganization: Organization | undefined = undefined;
  selectedActivity: Activity | undefined = undefined;
  selectedGroup: Group | undefined = undefined;

  shownActivitiesAndOrganizations: OrganizationActivityGroupMap = {};


  @ViewChild('inputNoActive', {static: false}) inputNoActive!: ElementRef;
  @ViewChild('inputName', {static: false}) inputName!: ElementRef;
  @ViewChild('inputDescription', {static: false}) inputDescription!: ElementRef;

  ngOnInit() {

    this.getData();

    console.log("ShownActivitiesAndOrganizations: ", this.shownActivitiesAndOrganizations);

    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.authService.getUser(this.sessionStorageService.get('username')).subscribe((user: User | undefined) => {
      this.user = user;
    });
  }

  manageMembers() {
    if (this.selectedOrganization && this.selectedActivity && this.selectedGroup) this.manageMembersService.openManageMembersPopup();
  }

  getData() {
    this.groupService.getGroupsByUsername(this.sessionStorageService.get("username")).subscribe(groups => {
      groups.forEach((group: Group) => {

        this.organizationService.getOrganizationById(group.parentOrganization).subscribe((organization: Organization) => {
            if (organization && !this.organizations.find(inner => organization._id === inner._id)) {
              this.organizations.push(organization);
            }
            this.activityService.getActivityById(group.parentOrganization, group.parentActivity).subscribe((activity: Activity) => {
                if (activity && !this.activities.find(inner => activity._id === inner._id)) {
                  this.activities.push(activity);
                }

                if (this.shownActivitiesAndOrganizations.hasOwnProperty(organization._id)) {

                  if (this.shownActivitiesAndOrganizations[organization._id].hasOwnProperty(activity._id)) {
                    this.shownActivitiesAndOrganizations[organization._id][activity._id].push(group);
                  } else {
                    this.shownActivitiesAndOrganizations[organization._id][activity._id] = [group];
                  }
                } else {
                  this.shownActivitiesAndOrganizations[organization._id] = {};
                  this.shownActivitiesAndOrganizations[organization._id][activity._id] = [group];
                }

                this.groups = this.shownActivitiesAndOrganizations[this.organizations[0]._id][this.activities[0]._id];

                this.selectedOrganization = this.organizations[0];
                this.selectedActivity = this.activities[0];
                this.selectedGroup = this.groups[0];

                this.inputName.nativeElement.value = this.selectedGroup.name;
                this.inputDescription.nativeElement.value = this.selectedGroup.description;

                this.loadActivities(this.selectedOrganization._id)

              }
            );

          }
        );
      });
      // El código dependiente de organizations y activities debe estar aquí


      this.rows = [];
      this.days = [false, false, false, false, false, false, false];
      this.result = [];

      this.loadSchedules();
    });
  }


  loadActivities(organization_Id: string) {

    this.shownActivities = [];
    const activityIds = this.shownActivitiesAndOrganizations[organization_Id];

    // Iterar sobre todas las actividades de la organización actual
    for (const activityId in activityIds) {
      this.activities.forEach((activity: Activity) => {
        if (activity._id.toString() === activityId.toString() && !this.shownActivities.find((act: Activity) => act._id === activity._id)) {
          this.shownActivities.push(activity);
        }
      });
    }
    console.log("ShownActivities: ", this.shownActivities);

  }

  loadActivity(selectElement
                 :
                 HTMLSelectElement
  ) {
    const selectedIndex_org = selectElement.selectedIndex;
    const selectedOrg = this.organizations[selectedIndex_org];

    this.selectedOrganization = selectedOrg;


    this.loadActivities(this.selectedOrganization._id);
    this.selectedActivity = this.shownActivities[0];

    if (this.selectedActivity) {
      this.groups = this.selectedActivity.groups;
      this.selectedGroup = this.groups[0];
      if (this.selectedGroup) {
        this.inputName.nativeElement.value = this.selectedGroup.name;
        this.inputDescription.nativeElement.value = this.selectedGroup.description;
        this.loadSchedules();
      } else {
        this.inputName.nativeElement.value = '';
        this.inputDescription.nativeElement.value = '';
        this.rows = [];
        this.days = [false, false, false, false, false, false, false];
        this.result = [];
      }
    } else {
      this.inputName.nativeElement.value = '';
      this.inputDescription.nativeElement.value = '';
      this.groups = [];
      this.selectedGroup = undefined;
      this.rows = [];
      this.days = [false, false, false, false, false, false, false];
      this.result = [];
    }

  }

  loadSchedules() {

    if (this.selectedGroup && this.selectedGroup.schedules) {
      this.selectedGroup.schedules.forEach(schedule => {
        const startTime = new Date(schedule.startTime).toLocaleTimeString('en-US', {hour12: false});
        const endTime = new Date(schedule.endTime).toLocaleTimeString('en-US', {hour12: false});

        if (!this.result.find((row: any) => row.horas.startTime === startTime && row.horas.endTime === endTime)) {
          this.result.push({
            horas: {startTime: startTime, endTime: endTime},
            dias: [false, false, false, false, false, false, false]
          });
        }

        if (!this.rows.find((row: any) => row.startTime === startTime && row.endTime === endTime)) {
          this.rows.push({startTime: startTime, endTime: endTime});
        }

        // Marcar los días correspondientes
        switch (schedule.day.toLowerCase()) {
          case 'lunes':
            this.days[0] = true;
            this.result[this.result.length - 1].dias[0] = true;
            break;
          case 'martes':
            this.days[1] = true;
            this.result[this.result.length - 1].dias[1] = true;
            break;
          case 'miércoles':
            this.days[2] = true;
            this.result[this.result.length - 1].dias[2] = true;
            break;
          case 'jueves':
            this.days[3] = true;
            this.result[this.result.length - 1].dias[3] = true;
            break;
          case 'viernes':
            this.days[4] = true;
            this.result[this.result.length - 1].dias[4] = true;
            break;
          case 'sábado':
            this.days[5] = true;
            this.result[this.result.length - 1].dias[5] = true;
            break;
          case 'domingo':
            this.days[6] = true;
            this.result[this.result.length - 1].dias[6] = true;
            break;
        }
      });
    }

  }


  loadGroup(selectElement
              :
              HTMLSelectElement
  ) {
    const selectedIndex_act = selectElement.selectedIndex;
    const selectedAct = this.shownActivities[selectedIndex_act];

    this.selectedActivity = selectedAct;

    this.groups = this.selectedActivity.groups;
    this.selectedGroup = this.groups[0];

    if (this.selectedGroup) {
      this.inputName.nativeElement.value = this.selectedGroup.name;
      this.inputDescription.nativeElement.value = this.selectedGroup.description;
      this.loadSchedules();
    } else {
      this.inputName.nativeElement.value = '';
      this.inputDescription.nativeElement.value = '';
      this.rows = [];
      this.days = [false, false, false, false, false, false, false];
      this.result = [];
    }
  }

  loadGroupInfo(selectElement
                  :
                  HTMLSelectElement
  ) {
    const selectedGroupName = selectElement.value;
    const selectedGroup = this.groups.find((group: Group) => group.name === selectedGroupName);
    if (selectedGroup) {
      this.inputName.nativeElement.value = selectedGroup.name;
      this.inputDescription.nativeElement.value = selectedGroup.description;
      this.selectedGroup = selectedGroup;
    }
  }


  toggleEditMode(inputElement
                   :
                   HTMLInputElement
  ) {
    if (inputElement) {
      const inputClass = inputElement.getAttribute('class');

      const newClass = inputClass === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('class', newClass);

      if (newClass === 'active') {
        inputElement.removeAttribute('readonly');
      } else {
        inputElement.setAttribute('readonly', 'true');
      }
    }
  }


  updateTable(event
                :
                any, index
                :
                number
  ) {
    if (event.target.tagName === 'TD') {
      if (event.target.id === 'delete-row') {
        return;
      } else {
        this.updateRow(event.target.id, index);
        if (event.target.style.backgroundColor !== 'green') {
          this.originalColor = event.target.style.backgroundColor;
          event.target.style.backgroundColor = 'green';
        } else {
          event.target.style.backgroundColor = this.originalColor;
        }
      }
    }
  }

  updateRow(targetId
              :
              string, index
              :
              number
  ) {
    let dayIndex = -1;
    switch (targetId) {
      case 'lunes':
        dayIndex = 0;
        break;
      case 'martes':
        dayIndex = 1;
        break;
      case 'miercoles':
        dayIndex = 2;
        break;
      case 'jueves':
        dayIndex = 3;
        break;
      case 'viernes':
        dayIndex = 4;
        break;
      case 'sabado':
        dayIndex = 5;
        break;
      case 'domingo':
        dayIndex = 6;
        break;
      case 'default':
        dayIndex = 7;
        break;
    }

    if (dayIndex !== -1) {
      this.result[index].dias[dayIndex] = !this.result[index].dias[dayIndex]
    }
  }


  updateTime() {
    for (let index = 0; index < this.rows.length; ++index) {
      this.result[index].horas.startTime = this.rows[index].startTime;
      this.result[index].horas.endTime = this.rows[index].endTime;
    }
  }

  addRow() {
    this.rows.push({
      startTime: '',
      endTime: '',
    });

    const newDays = Array(7).fill(false);

    this.result.push({
      horas: {startTime: '', endTime: ''},
      dias: newDays
    });
  }

  deleteRow(index
              :
              number
  ) {
    this.rows.splice(index, 1);
    this.result.splice(index, 1);
  }

  putGroup()
    :
    void {
    this.updateTime();
    const userData = AdminGroupsDataCollector.collectEventData(this.result, this.groups, this.inputName, this.inputDescription, this.selectedGroup);
    if (!
      userData.result
    ) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying.');
      return;
    }

    this.groupService.putGroup(userData.result.description, userData.result.horarios, userData.result.title,
      this.selectedOrganization?._id, this.selectedActivity?._id, this.selectedGroup?._id).subscribe((response: any) => {
      if (response.status === 200) {
        alert("Group updated successfully");
        this.getData();
      } else {
        alert(response.details);
      }
    });

  }

}
