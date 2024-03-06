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

  verifyEmail(email: string): boolean {
      // Patrón para verificar direcciones de correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      // Verificar si el correo cumple con el patrón
      return emailPattern.test(email);
  }

  verifyPass(contraseña: string): boolean {
    // Debe contener al menos 8 caracteres
    if (contraseña.length < 8) {
      return false;
    }
    
    // Debe contener al menos una letra minúscula
    if (!/[a-z]/.test(contraseña)) {
      return false;
    }
    
    // Debe contener al menos una letra mayúscula
    if (!/[A-Z]/.test(contraseña)) {
      return false;
    }
    
    // Debe contener al menos un dígito
    if (!/\d/.test(contraseña)) {
      return false;
    }
    
    return true;
  }

  async checkRegister() {

    var firstNameElement = <HTMLInputElement>document.getElementById('first-name');
    var lastNameElement = <HTMLInputElement>document.getElementById('last-name');
    var emailElement = <HTMLInputElement>document.getElementById('email');
    var passwordElement = <HTMLInputElement>document.getElementById('password');
    var confirmPasswordElement = <HTMLInputElement>document.getElementById('confirm-password');
    var usernameElement = <HTMLInputElement>document.getElementById('username');

    if (firstNameElement.value && lastNameElement.value && emailElement.value && passwordElement.value && confirmPasswordElement.value && usernameElement.value) {
      var firstName = firstNameElement.value;
      var lastName = lastNameElement.value;
      var email = emailElement.value;
      var password = passwordElement.value;
      var confirmPassword = confirmPasswordElement.value;
      var username = usernameElement.value;

      if (await this.registerService.checkUsername(username) === false) {
        alert('El nombre de usuario introducido ya existe.');
        return;
      }

      if (this.verifyEmail(email) === false) {
        alert('El correo electrónico introducido no es válido.');
        return;
      }

      if (!this.verifyPass(password)) {
        alert('La contraseña debe contener al menos 8 caracteres, una letra minúscula, una letra mayúscula y un dígito.');
        return;
      }

      if (password !== confirmPassword ) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      this.registerService.register(email, password, firstName, lastName, username);
    }else {
      alert('No se han introducido todos los campos.');

    }
  }

  openLoginPopup() {
    this.closeRegisterPopup();
    this.loginService.openLoginPopup();
  }

  closeRegisterPopup() {
    this.registerService.closeRegisterPopup();
  }
}
