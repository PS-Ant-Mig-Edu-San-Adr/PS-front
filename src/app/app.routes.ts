import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { AdminAddEventComponent } from './admin-add-event/admin-add-event.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'organizations',  component: OrganizationsComponent},
  { path: 'admin', component: AdminAddEventComponent}
];
