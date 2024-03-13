import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../generalServices/auth-service/login.component.service';
import { RegisterService } from '../generalServices/auth-service/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { PerfilButtonsComponent } from '../perfil-buttons/perfil-buttons.component'
import {AuthService} from "../generalServices/auth-service/auth.service";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-notifications',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, PerfilButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './perfil-notifications.component.html',
  styleUrl: './perfil-notifications.component.css'
})

export class PerfilNotificationsComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, protected authService: AuthService) {this.perfilNotifications = ElementRef.prototype;}


  active: number = 1;

  @Input() notificationsActive: boolean = false;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
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


  
}
