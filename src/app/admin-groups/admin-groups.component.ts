import { Component, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service'
import { ManageMembersPopUpComponent } from '../manage-members-pop-up/manage-members-pop-up.component'


@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageMembersPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css'
})
export class AdminGroupsComponent  implements OnInit {
  constructor(public manageMembersService: ManageMembersService, public sharedService: SharedPopupsService, public loginService: LoginService, public registerService: RegisterService) {}

  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
  manageMembers() {
    this.manageMembersService.openManageMembersPopup();
  }
}
