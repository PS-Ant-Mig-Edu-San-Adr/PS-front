import { Component } from '@angular/core';
import { RegisterService } from './register.component.service';
import { LoginService } from '../login/login.component.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private registerService: RegisterService, private loginService: LoginService) {}

  closeRegisterPopup() {
    this.registerService.closeRegisterPopup();
  }

  checkRegister() {
    this.registerService.register();
  }

  openLoginPopup() {
    this.closeRegisterPopup();
    this.loginService.openLoginPopup();
  }
}
