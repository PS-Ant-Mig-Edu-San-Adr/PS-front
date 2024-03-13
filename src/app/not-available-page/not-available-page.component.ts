import {Component, OnInit } from '@angular/core';
import {RegisterService} from '../generalServices/auth-service/register.component.service';
import {LoginService} from '../generalServices/auth-service/login.component.service';
import {SharedPopupsService} from "../generalServices/sharedPopups.service";
import {LoginComponent} from "../login/login.component";
import {RegisterComponent} from "../register/register.component";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "../generalServices/auth-service/auth.service";

@Component({
  selector: 'app-not-available-page',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    AsyncPipe,
    NgIf
  ],
  providers: [SharedPopupsService],
  templateUrl: './not-available-page.component.html',
  styleUrl: './not-available-page.component.css'
})
export class NotAvailablePageComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, public authService: AuthService) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
}
