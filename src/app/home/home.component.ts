import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, LoginComponent],
  providers: [LoginService],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
  ]
})
export class HomeComponent{

  constructor(public loginService: LoginService) {}

  handleOpenLoginEvent = () => {
    console.log('Open login event received');
    this.loginService.openLoginPopup();
    const homeContent = document.getElementsByClassName(".home-content")[0] as HTMLElement;
    homeContent.style.filter = 'blur(5px)';
  }
}
