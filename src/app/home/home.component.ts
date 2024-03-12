// home.component.ts
import {Component, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';
import {AuthService} from "../generalServices/auth-service/auth.service";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent],
  providers: [SharedPopupsService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, public authService: AuthService) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
}
