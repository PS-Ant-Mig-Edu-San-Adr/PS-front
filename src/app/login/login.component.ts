import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from "../generalServices/auth-service/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  constructor(private authService: AuthService) {}

  closeLoginPopup() {
    this.authService.closeLoginPopup();
  }

  async checkLogin() {
    const emailElement = <HTMLInputElement>document.getElementById('email');
    const passwordElement = <HTMLInputElement>document.getElementById('password');

    if (emailElement.value && passwordElement.value) {
      const email = emailElement.value;
      const password = passwordElement.value;

      this.authService.login(email, password);

    }else{
      alert('Por favor, llene todos los campos');
    }
  }

  openRegisterPopup() {
    this.authService.closeLoginPopup();
    this.authService.openRegisterPopup();
  }
}
