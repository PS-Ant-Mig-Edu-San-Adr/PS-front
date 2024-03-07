import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationsComponent } from './organizations/organizations.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'organizations',  component: OrganizationsComponent}
];
