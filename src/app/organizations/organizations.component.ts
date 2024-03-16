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
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, RouterLink],
  providers: [SharedPopupsService],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent implements OnInit {
  organizations: Organization[] = [];
  shownOrganizations: Organization[] = [];

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
      this.shownOrganizations = this.filterOrganizationsByName(searchTerm);
    } else {
      this.loadAllOrganizations();
    }
  }


  private loadAllOrganizations() {
    this.organizationService.getOrganizations().subscribe(
      (organizations: Organization[]) => {
        this.organizations = organizations;
        this.shownOrganizations = organizations;
      },
      (error) => {
        console.error('Error al obtener todas las organizaciones:', error);
      }
    );
    console.log("This is the organizations: ", this.organizations);
  }

  private filterOrganizationsByName(searchTerm: string): Organization[] {
    const filteredOrganizations: Organization[] = [];
    const regex = new RegExp(searchTerm, 'i'); // 'i' para que la búsqueda sea insensible a mayúsculas/minúsculas

    this.organizations.forEach((organization: Organization) => {
      if (regex.test(organization.name)) {
        filteredOrganizations.push(organization);
      }
    });

    return filteredOrganizations;
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
