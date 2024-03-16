import {Component, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AuthService} from "../generalServices/auth-service/auth.service";
import {Organization} from "../interfaces/interface";
import {OrganizationService} from "../generalServices/organization.service";

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent],
  providers: [SharedPopupsService],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];

  constructor(public sharedService: SharedPopupsService,
              protected authService: AuthService,
              private organizationService: OrganizationService) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.loadAllOrganizations();


  }

  searchOrganizations(searchTerm: string) {
    if (searchTerm.trim() !== '') {
      this.searchOrganizationsByName(searchTerm);
    } else {
      this.loadAllOrganizations();
    }
  }


  private loadAllOrganizations() {
    this.organizationService.getOrganizations().subscribe(
      (organizations: Organization[]) => {
        this.organizations = organizations;
      },
      (error) => {
        console.error('Error al obtener todas las organizaciones:', error);
      }
    );
    console.log("This is the organizations: ", this.organizations);
  }

  private searchOrganizationsByName(searchTerm: string) {
    this.organizationService.getOrganizationsByName(searchTerm).subscribe(
      (organizations: Organization[]) => {
        this.organizations = organizations;
      },
      (error) => {
        console.error('Error al buscar organizaciones:', error);
      }
    );
  }
}
