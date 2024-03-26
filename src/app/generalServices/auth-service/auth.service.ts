import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionStorageService} from "angular-web-storage";
import {LoginService} from './login.component.service';
import {RegisterService} from './register.component.service';
import {Observable, catchError, map, of} from 'rxjs';
import {User} from '../../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private sessionStorageService: SessionStorageService,
    private loginService: LoginService,
    private registerService: RegisterService
  ) {
  }

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
    const fullName = `${firstName} ${lastName}`;
    this.registerService.register(username, email, password, fullName);
  }


  getUserInfoFromSessionStorage(): { [key: string]: any } {
    let allData: { [key: string]: any } = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      let key = sessionStorage.key(i);
      if (key) {
        allData[key] = this.sessionStorageService.get(key);
      }
    }
    return allData;
  }


  getUser(username: string): Observable<User | undefined> {
    return this.httpClient.get<any>(`http://localhost:3001/api/searchUser/${username}`, {params: {username}}).pipe(
      map((res) => {
        if (res.status === 200) {
          return res.user;
        } else {
          return undefined;
        }
      }),
      catchError((error) => {
        console.error('Error al realizar la solicitud de obtener el usuario:', error);
        return of(undefined);
      })
    );
  }

  deleteUser(username: String): Observable<boolean> {
    return this.httpClient.delete<{ status: number }>(`http://localhost:3001/api/deleteUser/${username}`).pipe(
      map(res => {
        if (res.status === 200) {
          this.logout();
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Error al realizar la solicitud de eliminar el usuario:', error);
        return of(false);
      })
    );
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

  isLoginOpen$() {
    return this.loginService.isOpen$();
  }

  isRegisterOpen$() {
    return this.registerService.isOpen$();
  }

  loginStatus$() {
    return this.loginService.loginStatus$();
  }

  registerStatus$() {
    return this.registerService.registerStatus$();
  }

  loginObject$() {
    return this.loginService.loginObject$();
  }

  registerObject$() {
    return this.registerService.registerObject$();
  }
}
