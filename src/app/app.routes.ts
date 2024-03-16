import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {OrganizationsComponent} from './organizations/organizations.component';
import {SchedulesComponent} from './schedules/schedules.component';
import {AdminAddEventComponent} from './admin-add-event/admin-add-event.component';
import {AdminOrganizationsComponent} from './admin-organizations/admin-organizations.component';
import {AdminCreateOrganizationComponent} from "./admin-create-organization/admin-create-organization.component";
import {AdminGroupsComponent} from "./admin-groups/admin-groups.component";
import {AdminActivitiesComponent} from "./admin-activities/admin-activities.component"
import {PerfilInfoComponent} from "./perfil-info/perfil-info.component"
import {PerfilNotificationsComponent} from "./perfil-notifications/perfil-notifications.component"
import {CalendarPageComponent} from './calendar-page/calendar-page.component';
import {ActivitiesComponent} from './activities/activities.component';
import {NotAvailablePageComponent} from "./not-available-page/not-available-page.component"
import {authGuard} from "./generalServices/auth-service/auth.guard";
import {MiniCalendarComponent} from "./mini-calendar/mini-calendar.component";


export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'organizations', component: OrganizationsComponent},
  {path: 'schedules', component: SchedulesComponent},
  {path: 'minicalendar', component: MiniCalendarComponent},
  // ------------- Rutas protegidas -------------
  {path: 'admin', redirectTo: '/adminEvents', pathMatch: 'full'},
  {path: 'adminEvents', component: AdminAddEventComponent, canActivate: [authGuard]},
  {path: 'adminOrganizations', component: AdminOrganizationsComponent, canActivate: [authGuard]},
  {path: 'adminCreateOrganization', component: AdminCreateOrganizationComponent, canActivate: [authGuard]},
  {path: 'adminGroups', component: AdminGroupsComponent, canActivate: [authGuard]},
  {path: 'adminActivities', component: AdminActivitiesComponent, canActivate: [authGuard]},
  // ------------- Rutas protegidas -------------
  {path: 'perfilInfo', component: PerfilInfoComponent},
  {path: 'perfilNotifications', component: PerfilNotificationsComponent},
  {path: 'calendar', component: CalendarPageComponent},
  {path: 'activities', component: ActivitiesComponent}, // Si no se añade un parametro de ID
  {path: 'activities/:id', component: ActivitiesComponent}, // Añadir un parámetro de ID
  {path: 'notAvailable', component: NotAvailablePageComponent}
];
