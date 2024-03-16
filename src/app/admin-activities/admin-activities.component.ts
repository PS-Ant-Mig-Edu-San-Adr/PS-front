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
import { Activity, Organization } from '../interfaces/interface';
import { OrganizationService } from '../generalServices/organization.service';
import { SessionStorageService } from 'angular-web-storage';
import { ActivityService } from '../generalServices/activity.service';

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
              private sessionStorageService: SessionStorageService,
              private activityService: ActivityService) {}
  active: number = 3;
  organizations: Organization[] = [];
  activities: any;
  selectedActivity: any = {};
  
  @ViewChild('inputName', {static: false}) inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDescription', {static: false}) inputDescription!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputGroupName', {static: false}) inputGroupName!: ElementRef<HTMLInputElement>;
  @ViewChild('inputGroupDescription', {static: false}) inputGroupDescription!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('org_option', {static: false}) org_option!: ElementRef;
  @ViewChild('act_option', {static: false}) act_option!: ElementRef;


  ngOnInit() {

    this.organizationService.getOrganizationsByUsername(this.sessionStorageService.get("username")).subscribe(data => {
        this.organizations = data.organizations;
        this.activities = this.organizations[0].activities;
        this.selectedActivity = this.activities[0];
        this.inputName.nativeElement.value = this.activities[0].name;
        this.inputDescription.nativeElement.value = this.activities[0].description;
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
  }

  loadActivityInfo(selectElement: HTMLSelectElement){
    const selectedActName = selectElement.value;
    const selectedAct = this.activities.find((activity: Activity) => activity.name === selectedActName);
    this.selectedActivity = selectedAct;
    if (selectedAct) {
        this.inputName.nativeElement.value = selectedAct.name;
        this.inputDescription.nativeElement.value = selectedAct.description;
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

  CreateGroup(){
    console.log(this.inputDescription.nativeElement);
    /*
    const userData = AdminOrganizationsDataCollector.collectUserData(
      this.selectedOrganization!,
      this.inputTitulo.nativeElement.value as string,
      this.inputDescripcion.nativeElement.value as string,
      this.inputCorreo.nativeElement.value as string,
      this.inputContacto.nativeElement.value as string,
      this.inputDominio.nativeElement.value as string,
      this.selectPrivacidad.nativeElement.value as string
    );

    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying.');
      return;
    }

    if (!this.selectedOrganization) {
      alert('No organization selected.');
      return;
    }

    this.organizationService.putOrganization(this.selectedOrganization, userData.result).subscribe((res: any) => {
      if (res) {
        alert(res.details);
      } else {
        alert('Error updating organization.');
      }
    });

    */
  }

  SaveChanges(){
    const activity = this.activities.find((activity: Activity) => activity.name === this.inputName.nativeElement.value);
    console.log();
    if(activity){
      alert("La actividad ya existe");
    }else{
      this.putActivity(this.selectedActivity);
    }
  }

  putActivity(act: Activity): void {
    const activity_name = this.inputName.nativeElement.value as string;
    const activity_description = this.inputDescription.nativeElement.value as string;
    console.log(act);
    this.activityService.updateActivity(act._id, activity_name, activity_description).subscribe((res: any) => {
      if (res) {
        alert(res.details);
      } else {
        alert('Error updating organization.');
      }
    });


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