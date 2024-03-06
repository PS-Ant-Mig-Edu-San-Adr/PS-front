import { Component, OnDestroy } from '@angular/core';
import { LoginService } from './login.component.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  constructor(private loginService: LoginService) {}

  closeLoginPopup() {
    this.loginService.closeLoginPopup();
  }

  checkLogin() {
    this.loginService.login();
  }
}
