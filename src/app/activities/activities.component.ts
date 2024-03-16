// home.component.ts
import {Component, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AuthService} from "../generalServices/auth-service/auth.service";
import {Activity, Member, Organization} from "../interfaces/interface";
import {OrganizationService} from "../generalServices/organization.service";
import {ActivatedRoute} from "@angular/router";
import {ActivityService} from "../generalServices/activity.service";


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
  usersList: Member[] = [];

  constructor(
    private sharedService: SharedPopupsService,
    protected authService: AuthService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private activityService: ActivityService
  ) {
  }

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
  }

  handleJoinLeave(activity: Activity): void {
    if (this.isMember(activity)) {
      this.leaveActivity(activity._id);
    } else {
      this.joinActivity(activity._id);
    }
  }

  loadOrganizationAndActivities(organizationId: string) {
    this.organizationService.getOrganizationById(organizationId).subscribe(
      (organization: Organization | undefined) => {
        if (organization !== undefined) {
          this.organization = organization; // Almacena la organización actual
          this.activities = organization.activities;
          this.shownActivities = organization.activities;
          this.usersList = organization.members; // Asigna la lista de miembros a usersList
        } else {
          console.warn('La organización está vacía o no se encontró.');
        }
      },
      (error) => {
        console.error('Error al cargar las actividades:', error);
      }
    );
  }

  private getUserDataFromSessionStorage(): Member | null {
    const userInfoFromSessionStorage = this.authService.getUserInfoFromSessionStorage();
    if (!userInfoFromSessionStorage || Object.keys(userInfoFromSessionStorage).length === 0) {
      return null;
    }
    return {
      _id: userInfoFromSessionStorage['id'],
      name: userInfoFromSessionStorage['name'],
      username: userInfoFromSessionStorage['username'],
      email: userInfoFromSessionStorage['email'],
      role: 'member',
    };
  }



  private joinActivity(activity_id: string): void {
    const userData = this.getUserDataFromSessionStorage();
    if (!userData) {
      console.error('No se pudieron obtener los datos del usuario desde el sessionStorage.');
      alert("Debe iniciar sesión para unirse a la actividad");
      this.setJoinLeaveSuccess(false, activity_id);
      return;
    }

    this.activityService.addMember(activity_id, userData).subscribe(
      (response) => {
        if (response.success) {
          console.log("Miembro agregado con éxito:", response);
          this.setJoinLeaveSuccess(true, activity_id);

        } else {
          console.error('Error al agregar el miembro:', response.details);
          this.setJoinLeaveSuccess(false, activity_id);
        }
      },
      (error) => {
        console.error('Error al agregar el miembro:', error);
        this.setJoinLeaveSuccess(false, activity_id);
      }
    );
  }

  private leaveActivity(activity_id: string): void {
    const userData = this.getUserDataFromSessionStorage();
    if (!userData) {
      console.error('No se pudieron obtener los datos del usuario desde el sessionStorage.');
      alert("Debe iniciar sesión para unirse a la actividad");
      this.setJoinLeaveSuccess(false, activity_id);
      return;
    }

    // Llamar al método para eliminar al usuario de la actividad
    this.activityService.removeMember(activity_id, userData).subscribe(
      (response) => {
        // Verificar si la respuesta indica éxito
        if (response.success) {
          console.log("Miembro eliminado con éxito:", response);
          this.setJoinLeaveSuccess(true, activity_id);
        } else {
          console.error('Error al eliminar el miembro:', response.details);
          this.setJoinLeaveSuccess(false, activity_id);
        }
      },
      (error) => {
        console.error('Error al eliminar el miembro:', error);
        this.setJoinLeaveSuccess(false, activity_id);
      }
    );
  }

  private setJoinLeaveSuccess(success: boolean, activityId: string): void {
    // Establecer la clase de animación según el resultado de la operación

    const button = document.getElementById(`joinButton_${activityId}`);
    if (button) {
      // Obtener una referencia al elemento button-text dentro del botón
      // Manejar la animación del botón según el resultado de la operación
      if (success) {
        button.classList.add('success-animation', 'success-icon');

      } else {
        button.classList.add('error-animation', 'error-icon');
      }

      // Reiniciar la clase después de un cierto tiempo (por ejemplo, 2 segundos)
      setTimeout(() => {
        button.classList.remove('success-animation', 'error-animation', 'success-icon', 'error-icon');
        this.loadOrganizationAndActivities(this.organizationId);
      }, 1000); // 1000 milisegundos = 1 segundo
    }
  }

  isMember(activity: Activity): boolean {
    const userInfoFromSessionStorage = this.authService.getUserInfoFromSessionStorage();

    if (!userInfoFromSessionStorage || Object.keys(userInfoFromSessionStorage).length === 0) {
      console.error('No se pudieron obtener los datos del usuario desde el sessionStorage o el objeto está vacío.');
      return false;
    }

    const username = userInfoFromSessionStorage['username'];
    return activity.members.some(member => member.username === username);
  }


}
