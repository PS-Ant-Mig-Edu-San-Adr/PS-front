import { Component, OnDestroy } from '@angular/core';
import { LoginService } from './login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import e from 'express';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  constructor(private loginService: LoginService, private registerService: RegisterService) {}

  closeLoginPopup() {
    this.loginService.closeLoginPopup();
  }

  async checkLogin() {
    var emailElement = <HTMLInputElement>document.getElementById('email');
    var passwordElement = <HTMLInputElement>document.getElementById('password');

    if (emailElement.value && passwordElement.value) {
      var email = emailElement.value;
      var password = passwordElement.value;

      this.loginService.login(email, password);

    }else{
      alert('Por favor, llene todos los campos');
    }
  }

  openRegisterPopup() {
    this.loginService.closeLoginPopup();
    this.registerService.openRegisterPopup();
  }
}
