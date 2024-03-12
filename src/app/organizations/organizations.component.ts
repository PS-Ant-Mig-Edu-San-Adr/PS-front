import {Component, OnInit} from '@angular/core';
import {SharedPopupsService} from '../generalServices/sharedPopups.service';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {FooterComponent} from '../footer/footer.component';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent],
  providers: [SharedPopupsService],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService) {}

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
}
