import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionStorageService} from "angular-web-storage";
import {LoginService} from './login.component.service';
import {RegisterService} from './register.component.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private sessionStorageService: SessionStorageService,
    private loginService: LoginService,
    private registerService: RegisterService
  ) {}

  // Métodos y observables para la funcionalidad de registro
  checkUsername(username: string): Promise<boolean> {
    return this.registerService.checkUsername(username);
  }

  openRegisterPopup() {
    this.registerService.openRegisterPopup();
  }

  closeRegisterPopup() {
    this.registerService.closeRegisterPopup();
  }

  register(email: string, password: string, firstName: string, lastName: string, username: string) {
    this.registerService.register(email, password, firstName, lastName, username);
  }

  // Métodos y observables para la funcionalidad de inicio de sesión
  openLoginPopup() {
    this.loginService.openLoginPopup();
  }

  closeLoginPopup() {
    this.loginService.closeLoginPopup();
  }

  login(email: string, password: string) {
    this.loginService.login(email, password);
  }

  logout() {
    this.loginService.logout();
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }
}
