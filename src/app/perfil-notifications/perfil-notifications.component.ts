import { Component, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../generalServices/auth-service/login.component.service';
import { RegisterService } from '../generalServices/auth-service/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { PerfilButtonsComponent } from '../perfil-buttons/perfil-buttons.component'

@Component({
  selector: 'app-perfil-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, PerfilButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './perfil-notifications.component.html',
  styleUrl: './perfil-notifications.component.css'
})
export class PerfilNotificationsComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService) {}

  active: number = 1;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
}
