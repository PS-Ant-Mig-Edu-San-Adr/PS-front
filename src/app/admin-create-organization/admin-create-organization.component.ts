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
import {AuthService} from "../generalServices/auth-service/auth.service";
import { AdminCreateOrganizationDataCollector } from './admin-create-organization-data-collector';
import { User } from "../interfaces/interface";
import { SessionStorageService } from 'angular-web-storage';
import { OrganizationService } from '../generalServices/organization.service';


@Component({
  selector: 'app-admin-create-organization',
  standalone: true,
  imports: [CommonModule,  HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageMembersPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-create-organization.component.html',
  styleUrl: './admin-create-organization.component.css'
})
export class AdminCreateOrganizationComponent implements OnInit{
  constructor(public manageMembersService: ManageMembersService, public sharedService: SharedPopupsService,
  protected authService: AuthService, private sessionStorageService: SessionStorageService, public organizationService: OrganizationService) {}
  
  @ViewChild('inputName', { static: false }) inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDescription', { static: false }) inputDescription!: ElementRef<HTMLInputElement>;
  @ViewChild('inputEmail', { static: false }) inputEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDomain', { static: false }) inputDomain!: ElementRef<HTMLInputElement>;
  @ViewChild('inputContact', { static: false }) inputContact!: ElementRef<HTMLSelectElement>;
  @ViewChild('selectPrivacy', { static: false }) selectPrivacy!: ElementRef;

  
  active: number = 1;
  user: User | undefined;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
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
    this.manageMembersService.openManageMembersPopup();
  }

  createOrganization(): void {
    console.log('Creating organization...');
    const userData = AdminCreateOrganizationDataCollector.collectUserData();

    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying your profile.');
      return;
    }

    this.organizationService.createOrganization(
        username, 
        this.inputName.nativeElement.value,
        this.inputDescription.nativeElement.value,
        this.inputEmail.nativeElement.value,
        this.inputDomain.nativeElement.value,
        this.inputContact.nativeElement.value,
        this.selectPrivacy.nativeElement.value
      ).subscribe((res: any) => {
      if (res) {
        alert(res.details)
      } else {
        alert('Error creating the organization.');
      }
    });

  }
}
