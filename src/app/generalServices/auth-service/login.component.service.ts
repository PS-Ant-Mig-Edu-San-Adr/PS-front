import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SessionStorageService} from "angular-web-storage";
import {User} from '../../interfaces/interface';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient, private sessionStorageService: SessionStorageService) {
  }

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  private loginObjectSubject = new BehaviorSubject<User>({
    id: '',
    fullName: '',
    email: '',
    username: '',
    passwordHash: '',
    creationDate: '',
    timeZone: '',
    preferredLanguage: '',
    notificationSettings: '',
    avatar: '',
    calendar: '',
    groups: [],
    tags: [],
  });
  loginObject$ = this.loginObjectSubject.asObservable();

  openLoginPopup() {
    this.isOpenSubject.next(true);
  }

  closeLoginPopup() {
    this.isOpenSubject.next(false);
  }

  login(email: string, password: string) {
    this.httpClient.post<any>('http://localhost:3001/api/login', {email, password}).subscribe(
      (res) => {
        if (res.status === 200) {
          this.closeLoginPopup();
          this.sessionStorageService.set('token', res.token);
          this.sessionStorageService.set('username', res.user.username);
          this.sessionStorageService.set('profilePict', res.user.avatar);
          this.loginStatusSubject.next(true);
          this.loginObjectSubject.next(res.user);
        } else {
          this.loginStatusSubject.next(false);
          alert('Error al loggearse: ' + res.details);
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud de inicio de sesión:', error);
        this.loginStatusSubject.next(false);
        alert('Error al realizar la solicitud de inicio de sesión');
      }
    );
  }

  logout() {
    // Verificar si el usuario está autenticado antes de cerrar la sesión
    if (this.isLoggedIn()) {
      // Eliminar el token y la información de usuario del sessionStorage
      this.sessionStorageService.remove('token');
      this.sessionStorageService.remove('username');
      this.sessionStorageService.remove('profilePict');
      // Emitir un valor falso para indicar que el usuario está desconectado
      this.loginStatusSubject.next(false);
      // También podrías realizar una solicitud HTTP para cerrar la sesión en el servidor, si es necesario
    }
  }

  isLoggedIn(): boolean {
    // Verificar si el token está presente en el sessionStorage para determinar si el usuario está autenticado
    return !!this.sessionStorageService.get('token'); //FIXME: Must verify token validity
  }
}
