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
import { Activity, Organization, User } from '../interfaces/interface';
import { OrganizationService } from '../generalServices/organization.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageMembersPopUpComponent, GroupAddPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-activities.component.html',
  styleUrl: './admin-activities.component.css'
})
export class AdminActivitiesComponent implements  OnInit {
  constructor(public addGroup: GroupAddPopUpService, protected authService: AuthService,
              public manageMembersService: ManageMembersService, public sharedService: SharedPopupsService,
              private organizationService: OrganizationService,
              private sessionStorageService: SessionStorageService) {}
  active: number = 3;
  organizations: Organization[] = [];
  activities: any;
  selectedOrganization: Organization | undefined = undefined;
  selectedActivity: Activity | undefined = undefined;
  user: User | undefined = undefined;
  
  @ViewChild('inputName', {static: false}) inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDescription', {static: false}) inputDescription!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputGroupName', {static: false}) inputGroupName!: ElementRef<HTMLInputElement>;

  ngOnInit() {

    this.organizationService.getOrganizationsByUsername(this.sessionStorageService.get("username")).subscribe(data => {
        this.organizations = data.organizations;
        this.activities = this.organizations[0].activities;
        this.inputName.nativeElement.value = this.activities[0].name;
        this.inputDescription.nativeElement.value = this.activities[0].description;
        this.selectedOrganization = this.organizations[0];
        this.selectedActivity = this.activities[0];
    });

    this.authService.getUser(this.sessionStorageService.get("username")).subscribe((user: User | undefined) => {
      this.user = user;
    });

    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.addGroup.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }

  GroupAddPopup(){
    this.addGroup.openGroupAddPopup();
  }

  manageMembers() {
    this.manageMembersService.openManageMembersPopup();
  }

  loadActivity(selectElement: HTMLSelectElement){
    const selectedIndex_org = selectElement.selectedIndex;
    const selectedOrg = this.organizations[selectedIndex_org];
    this.activities = selectedOrg.activities;
    this.inputName.nativeElement.value = this.activities[0].name;
    this.inputDescription.nativeElement.value = this.activities[0].description;
    this.selectedOrganization = selectedOrg;
  }

  loadActivityInfo(selectElement: HTMLSelectElement){
    const selectedActName = selectElement.value;
    const selectedAct = this.activities.find((activity: Activity) => activity.name === selectedActName);
    if (selectedAct) {
        this.inputName.nativeElement.value = selectedAct.name;
        this.inputDescription.nativeElement.value = selectedAct.description;
        this.selectedActivity = selectedAct;
    }
  }

  checkEmpty(){
    if(!this.inputName.nativeElement.value){
      alert("Por favor, inserte un título para la actividad.");
    }
    if(!this.inputGroupName.nativeElement.value){
      alert("Por favor, inserte un nombre para el grupo.");
    }
  }

  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;
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