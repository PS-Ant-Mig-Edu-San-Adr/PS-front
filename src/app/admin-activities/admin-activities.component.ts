import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AdminButtonsComponent} from '../admin-buttons/admin-buttons.component';
import {ManageMembersService} from '../manage-members-pop-up/manage-members-pop-up.component.service'
import {ManageMembersPopUpComponent} from '../manage-members-pop-up/manage-members-pop-up.component'
import {GroupAddPopUpComponent} from '../group-add-pop-up/group-add-pop-up.component';
import {GroupAddPopUpService} from '../group-add-pop-up/group-add-pop-up.service';
import {AuthService} from "../generalServices/auth-service/auth.service";
import {Activity, Organization, User} from '../interfaces/interface';
import {OrganizationService} from '../generalServices/organization.service';
import {SessionStorageService} from 'angular-web-storage';
import {ActivityService} from '../generalServices/activity.service';
import {Observable, map, of} from 'rxjs';


interface OrganizationActivityMap {
  [organizationId: string]: Activity[];
}

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageMembersPopUpComponent, GroupAddPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-activities.component.html',
  styleUrl: './admin-activities.component.css'
})
export class AdminActivitiesComponent implements OnInit {
  constructor(public addGroup: GroupAddPopUpService, protected authService: AuthService,
              public manageMembersService: ManageMembersService, public sharedService: SharedPopupsService,
              private organizationService: OrganizationService,
              private sessionStorageService: SessionStorageService,
              private activityService: ActivityService) {
  }

  active: number = 3;
  organizations: Organization[] = [];
  activities: Activity[] = [];
  selectedOrganization: Organization | undefined = undefined;
  selectedActivity: Activity | undefined = undefined;
  user: User | undefined = undefined;
  shownActivitiesAndOrganizations: OrganizationActivityMap = {};


  @ViewChild('inputName', {static: false}) inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDescription', {static: false}) inputDescription!: ElementRef<HTMLTextAreaElement>;


  ngOnInit() {

    this.getData();

    console.log("ShownActivitiesAndOrganizations: ", this.shownActivitiesAndOrganizations);

    this.authService.getUser(this.sessionStorageService.get("username")).subscribe((user: User | undefined) => {
      this.user = user;
    });

    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.addGroup.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }

  GroupAddPopup() {
    if (this.selectedOrganization && this.selectedActivity) this.addGroup.openGroupAddPopup();
  }

  manageMembers() {
    if (this.selectedOrganization && this.selectedActivity) this.manageMembersService.openManageMembersPopup();

  }

  getData() {
    this.activityService.getActivitiesByUsername(this.sessionStorageService.get("username")).subscribe(activities => {
      activities.forEach((activity: Activity) => {
        this.organizationService.getOrganizationById(activity.parentOrganization).subscribe((organization: Organization) => {
          this.organizations.push(organization);
          this.shownActivitiesAndOrganizations.hasOwnProperty(organization._id) ? this.shownActivitiesAndOrganizations[organization._id].push(activity) :  this.shownActivitiesAndOrganizations[organization._id] = [activity];

          this.activities = this.shownActivitiesAndOrganizations[this.organizations[0]._id];

          this.selectedActivity = this.activities[0];
          this.inputName.nativeElement.value = this.activities[0].name;
          this.inputDescription.nativeElement.value = this.activities[0].description;
          this.selectedOrganization = this.organizations[0];

        });
      });
    });
  }

  loadActivity(selectElement: HTMLSelectElement) {
    const selectedIndex_org = selectElement.selectedIndex;
    const selectedOrg = this.organizations[selectedIndex_org];
    this.activities = this.shownActivitiesAndOrganizations[selectedOrg._id];
    this.inputName.nativeElement.value = this.activities[0].name;
    this.inputDescription.nativeElement.value = this.activities[0].description;
    this.selectedOrganization = selectedOrg;
    this.selectedActivity = this.selectedOrganization.activities[0];
  }

  loadActivityInfo(selectElement: HTMLSelectElement) {
    const selectedActName = selectElement.value;
    const selectedAct = this.activities.find((activity: Activity) => activity.name === selectedActName);
    if (selectedAct) {
      this.inputName.nativeElement.value = selectedAct.name;
      this.inputDescription.nativeElement.value = selectedAct.description;
      this.selectedActivity = selectedAct;
    } else {
      this.inputName.nativeElement.value = "";
      this.inputDescription.nativeElement.value = "";
      this.selectedActivity = undefined;
    }
  }

  checkEmpty(): boolean {
    if (!this.inputName.nativeElement.value) {
      alert("Por favor, inserte un título para la actividad.");
      return true;
    } else {
      return false;
    }
  }

  SaveChanges() {
    if (!this.checkEmpty()) {
      const activity = this.activities.find((activity: Activity) => activity.name === this.inputName.nativeElement.value);
      if (activity) {
        alert("La actividad ya existe");
      } else {
        this.putActivity().subscribe(result => {
          if (result) this.getData();
        });
      }
    }
  }

  putActivity(): Observable<boolean> {
    const activity_name = this.inputName.nativeElement.value as string;
    const activity_description = this.inputDescription.nativeElement.value as string;

    return this.activityService.updateActivity(this.selectedOrganization?._id, this.selectedActivity?._id, activity_name, activity_description)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            alert(res.details);
            return true;
          } else {
            alert('Error updating organization.');
            return false;
          }
        })
      );
  }

  @ViewChild('inputNoActive', {static: false}) inputNoActive!: ElementRef;

  toggleEditMode(inputElement: HTMLInputElement) {
    if (inputElement) {
      const inputId = inputElement.getAttribute('class');

      // Cambiar entre "noactive" y "active"
      const newId = inputId === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('class', newId);

      // Verificar el ID para habilitar o deshabilitar la edición
      if (newId === 'active') {
        inputElement.removeAttribute('readonly'); // Habilitar la edición
      } else {
        inputElement.setAttribute('readonly', 'true'); // Deshabilitar la edición
      }
    }
  }
}
