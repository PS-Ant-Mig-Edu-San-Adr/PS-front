// home.component.ts
import {Component, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AuthService} from "../generalServices/auth-service/auth.service";
import {Activity, Organization} from "../interfaces/interface";
import {OrganizationService} from "../generalServices/organization.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent],
  providers: [SharedPopupsService],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  shownActivities: Activity[] = [];
  organizationId: string = '';
  organization: Organization | null = null; // Propiedad para almacenar la organización actual

  constructor(
    private sharedService: SharedPopupsService,
    protected authService: AuthService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.route.paramMap.subscribe(params => {
      const organizationId = params.get('id');
      if (organizationId !== null) {
        this.organizationId = organizationId;
        this.loadOrganizationAndActivities(this.organizationId);
      } else {
        console.error('El parámetro ID está vacío.');
      }
    });

    console.log("Activities: ", this.activities);
  }

  loadOrganizationAndActivities(organizationId: string) {
    this.organizationService.getOrganizationById(organizationId).subscribe(
      (organization: Organization | undefined) => {
        console.log("Found Organization: ", organization)
        if (organization !== undefined) {
          this.organization = organization; // Almacena la organización actual
          this.activities = organization.activities;
          this.shownActivities = organization.activities;
        } else {
          console.warn('La organización está vacía o no se encontró.');
        }
      },
      (error) => {
        console.error('Error al cargar las actividades:', error);
      }
    );
  }
}
