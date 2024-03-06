import { Component, OnDestroy } from '@angular/core';
import { LoginService } from './login.component.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  constructor(private loginService: LoginService) {}

  closeLoginPopup() {
    this.loginService.closeLoginPopup();
  }
}
