import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../generalServices/auth-service/login.component.service';
import { RegisterService } from '../generalServices/auth-service/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';
import { ManageActivitiesPopUpComponent } from '../manage-activities-pop-up/manage-activities-pop-up.component';
import { ManageActivitiesPopUpService } from '../manage-activities-pop-up/manage-activities-pop-up.service';
import {AuthService} from "../generalServices/auth-service/auth.service";
import { AdminOrganizationsDataCollector } from './admin-organizations-data-collector';
import { User } from "../interfaces/interface";
import { SessionStorageService } from 'angular-web-storage';
import { AdminService } from '../generalServices/admin.service';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service';
import { ManageMembersPopUpComponent } from '../manage-members-pop-up/manage-members-pop-up.component';

@Component({
  selector: 'app-admin-organizations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageActivitiesPopUpComponent, ManageMembersPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-organizations.component.html',
  styleUrl: './admin-organizations.component.css'
})
export class AdminOrganizationsComponent implements  OnInit{
  constructor(
    public manageMembersService: ManageMembersService,
    public addActivitiesPopUP: ManageActivitiesPopUpService, 
    public sharedService: SharedPopupsService, 
    protected authService: AuthService,
    private sessionStorageService: SessionStorageService,
    ) {}
  active: number = 2;
  user: User | undefined;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.addActivitiesService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.authService.getUser(this.sessionStorageService.get('username')).subscribe((user: User | undefined) => {
      this.user = user;
    });
  }

  addActivities(){
    this.addActivitiesPopUP.openAddActivityPopup();
  }

  addMembers(){
    this.manageMembersService.openManageMembersPopup();
  }



  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;


  toggleEditMode(inputElement: HTMLElement) {
    if (inputElement) {
      const inputId = inputElement.getAttribute('id');

      // Cambiar entre "noactive" y "active"
      const newId = inputId === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('id', newId);

      // Verificar el tipo de elemento y habilitar o deshabilitar la edición en consecuencia
      if (newId === 'active') {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).removeAttribute('readonly'); // Habilitar la edición
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).removeAttribute('disabled'); // Habilitar la edición
        }
      } else {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).setAttribute('readonly', 'true'); // Deshabilitar la edición
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).setAttribute('disabled', 'true'); // Deshabilitar la edición
        }
      }
    }
  }

  general(): void {
    const userData = AdminOrganizationsDataCollector.collectUserData();

    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying your profile.');
      return;
    }

    

  }
}


