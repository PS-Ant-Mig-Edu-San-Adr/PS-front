import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from "../generalServices/auth-service/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

    constructor(private authService: AuthService) {}

  verifyEmail(email: string): boolean {
      // Patrón para verificar direcciones de correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Verificar si el correo cumple con el patrón
      return emailPattern.test(email);
  }

  verifyPass(password: string): boolean {
    // Debe contener al menos 8 caracteres
    if (password.length < 8) {
      return false;
    }

    // Debe contener al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Debe contener al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Debe contener al menos un dígito
    return /\d/.test(password);


  }

  async checkRegister() {

    const firstNameElement = <HTMLInputElement>document.getElementById('first-name');
    const lastNameElement = <HTMLInputElement>document.getElementById('last-name');
    const emailElement = <HTMLInputElement>document.getElementById('email');
    const passwordElement = <HTMLInputElement>document.getElementById('password');
    const confirmPasswordElement = <HTMLInputElement>document.getElementById('confirm-password');
    const usernameElement = <HTMLInputElement>document.getElementById('username');

    if (firstNameElement.value && lastNameElement.value && emailElement.value && passwordElement.value && confirmPasswordElement.value && usernameElement.value) {
      const firstName = firstNameElement.value;
      const lastName = lastNameElement.value;
      const email = emailElement.value;
      const password = passwordElement.value;
      const confirmPassword = confirmPasswordElement.value;
      const username = usernameElement.value;

      // if (!await this.authService.checkUsername(username)) {
      //   alert('El nombre de usuario introducido ya existe.');
      //   return;
      // }

      if (!this.verifyEmail(email)) {
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

      this.authService.register(email, password, firstName, lastName, username);
    }else {
      alert('No se han introducido todos los campos.');

    }
  }

  openLoginPopup() {
    this.closeRegisterPopup();
    this.authService.openLoginPopup();
  }

  closeRegisterPopup() {
    this.authService.closeRegisterPopup();
  }
}
