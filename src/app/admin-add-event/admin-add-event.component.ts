// adminAddEvent.component.ts
import {Component, OnInit, importProvidersFrom} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {LoginService} from '../login/login.component.service';
import {RegisterService} from '../register/register.component.service';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AdminButtonsComponent} from '../admin-buttons/admin-buttons.component';
import {AdminEventDataCollector} from './admin-add-event-data-collector';
import {HttpClient} from "@angular/common/http";
import {SessionStorageService} from "angular-web-storage";


@Component({
  selector: 'app-admin-add-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-add-event.component.html',
  styleUrl: './admin-add-event.component.css'
})


export class AdminAddEventComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService,
              public loginService: LoginService,
              public registerService: RegisterService,
              private httpClient: HttpClient,
              private sessionStorageService: SessionStorageService) {
  }
  active: number = 0;
  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

  }

  onAddGroupClick(): void {
    // Collect event data
    const eventData = AdminEventDataCollector.collectEventData();

    // Check if all required fields are filled
    if (!eventData) {
      alert('Please complete all required fields.');
      return;
    }

    // Define the username and the URL for the POST request
    const username = this.sessionStorageService.get('username');
    if (!username) {
      alert('Please log in before adding an event.');
      return;
    }

    const url = `http://localhost:3001/api/events/${username}`;

    // Make the POST request
    this.processHttpRequest(url, eventData);
  }

  private processHttpRequest(url: string, eventData: any): void {
    // Make the POST request
    this.httpClient.post(url, eventData).subscribe(
      (res) => {
        console.log('Event data successfully posted:', res);
        alert('Data successfully submitted.');
      },
      (error) => {
        console.error('Error posting event data:', error);
        alert('Error submitting data. Please try again later.');
      }
    );
  }
}
