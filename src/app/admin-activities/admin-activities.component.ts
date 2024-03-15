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
import { HttpClient } from '@angular/common/http';
import { Organization } from '../interfaces/interface';
import { OrganizationService } from '../generalServices/organization.service';
import { response } from 'express';

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
              private organizationService: OrganizationService) {}
  active: number = 3;
  organizations: Organization[] = [];
  

  ngOnInit() {

    this.organizationService.getOrganizations().subscribe(data => {
        console.log(data);
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