import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { PerfilButtonsComponent } from '../perfil-buttons/perfil-buttons.component'
import {AuthService} from "../generalServices/auth-service/auth.service";
import { FormsModule } from '@angular/forms';
import {SessionStorageService} from 'angular-web-storage';
import { PerfilNotificactionService } from "./perfil-notifications.component.service";
import {User} from '../interfaces/interface';
import { PerfilNotificationsDataCollector } from './perfil-notiifications-data-collector';

@Component({
  selector: 'app-perfil-notifications',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, PerfilButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './perfil-notifications.component.html',
  styleUrl: './perfil-notifications.component.css'
})

export class PerfilNotificationsComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, 
    public authService: AuthService,
    public sessionStorageService: SessionStorageService,
    public perfilNotificactionService: PerfilNotificactionService
  ) {this.perfilNotifications = ElementRef.prototype;}

  @ViewChild('activeEvents', { static: false }) activeEvents!: ElementRef<HTMLInputElement>;
  @ViewChild('activeNotifications', { static: false }) activeNotifications!: ElementRef<HTMLInputElement>;
  @ViewChild('activeReminder', { static: false }) activeReminder!: ElementRef<HTMLInputElement>;
  @ViewChild('activeApp', { static: false }) activeApp!: ElementRef<HTMLInputElement>;
  @ViewChild('activeEmail', { static: false }) activeEmail!: ElementRef<HTMLSelectElement>;

  active: number = 1;
  user: User | undefined;
  notificationsSettings: string = '';

  @Input() notificationsActive: boolean = false;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.perfilNotificactionService.getUser(this.sessionStorageService.get('username')).subscribe((user: User | undefined) => {
      this.user = user;
      this.loadNotifications();
    });

  }

  @ViewChild('perfilNotifications', { static: false }) perfilNotifications  : ElementRef;
  setCheckBoxState() {
    if (!this.notificationsActive) {
      const children = this.perfilNotifications.nativeElement.children;
      for (let i = 1; i < children.length; i++) {
        console.log(children[i]);
        const checkbox = children[i].querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = false;
        }
      }
    }
  }

  loadNotifications()  {
    switch (this.user?.notificationSettings) {
      case 'Disabled':
        this.activeEvents.nativeElement.checked = false;
        this.activeNotifications.nativeElement.checked = this.notificationsActive = false;
        this.activeReminder.nativeElement.checked = false;
        break;
      case 'OnlyEvents':
        this.activeEvents.nativeElement.checked = true;
        this.activeNotifications.nativeElement.checked = this.notificationsActive  = true;
        this.activeReminder.nativeElement.checked = false;
        break;
      case 'OnlyReminders':
        this.activeEvents.nativeElement.checked = false;
        this.activeNotifications.nativeElement.checked = this.notificationsActive  = true;
        this.activeReminder.nativeElement.checked = true;
        break;
      case 'Enabled':
        this.activeEvents.nativeElement.checked = true;
        this.activeNotifications.nativeElement.checked = this.notificationsActive  = true;
        this.activeReminder.nativeElement.checked = true;
        break;
      default:
        // No se reconoce el valor, desactiva todos los checkboxes por defecto
        this.activeEvents.nativeElement.checked = false;
        this.activeNotifications.nativeElement.checked = this.notificationsActive  = false;
        this.activeReminder.nativeElement.checked = false;
        break;
    }
  }
  
  onModifyUserClick(): void {
    const userData = PerfilNotificationsDataCollector.collectUserData(this.user as User);

    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying your profile.');
      return;
    }

    const eventsChecked = this.activeEvents.nativeElement.checked;
    const notificationsChecked = this.activeNotifications.nativeElement.checked;
    const reminderChecked = this.activeReminder.nativeElement.checked;

    if (!notificationsChecked) {
      this.notificationsSettings = 'Disabled';
    } else if (eventsChecked && !reminderChecked) {
      this.notificationsSettings = 'OnlyEvents';
    } else if (!eventsChecked && reminderChecked) {
      this.notificationsSettings = 'OnlyReminders';
    } else {
      this.notificationsSettings = 'Enabled';
    }

    this.perfilNotificactionService.putUser(
        this.notificationsSettings,
        this.sessionStorageService.get('username')
      ).subscribe((res) => {
      if (res) {
        alert('Profile modified successfully.');
      } else {
        alert('There was an error modifying your profile.');
      }
    });

  }

  
}
