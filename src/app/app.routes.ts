import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { AdminAddEventComponent } from './admin-add-event/admin-add-event.component';
import { AdminOrganizationsComponent } from './admin-organizations/admin-organizations.component';
import {AdminCreateOrganizationComponent} from  "./admin-create-organization/admin-create-organization.component";
import { AdminGroupsComponent } from "./admin-groups/admin-groups.component";
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'organizations',  component: OrganizationsComponent},
  { path: 'schedules',  component: SchedulesComponent},
  { path: 'admin', component: AdminAddEventComponent},
  { path: 'adminOrganizations', component: AdminOrganizationsComponent},
  { path: 'adminCreateOrganization', component: AdminCreateOrganizationComponent },
  { path: 'adminGroups', component: AdminGroupsComponent}
];
