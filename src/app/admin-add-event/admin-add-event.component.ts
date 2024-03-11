// adminAddEvent.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';


@Component({
  selector: 'app-admin-add-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-add-event.component.html',
  styleUrl: './admin-add-event.component.css'
})

export class AdminAddEventComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, public loginService: LoginService, public registerService: RegisterService) {}
  active: number = 0;
  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
}
