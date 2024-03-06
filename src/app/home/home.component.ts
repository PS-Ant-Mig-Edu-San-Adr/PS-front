import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, LoginComponent, RegisterComponent],
  providers: [LoginService, RegisterService],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
  ]
})
export class HomeComponent{

  constructor(public loginService: LoginService, public registerService: RegisterService) {}

  handleOpenLoginEvent = () => {
    this.loginService.openLoginPopup();
  }

  handleOpenRegisterEvent = () => {
    this.registerService.openRegisterPopup();
  }
}
