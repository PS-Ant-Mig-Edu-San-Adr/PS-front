import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {}

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private registerStatusSubject = new BehaviorSubject<boolean>(false);
  registerStatus$ = this.registerStatusSubject.asObservable();

  async checkUsername(username: string): Promise<boolean> {
    try {
      const result = await this.httpClient.get<any>(`http://localhost:3001/api/check-username/${username}`).toPromise();
      if (result.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar el nombre de usuario:', error);
      return false;
    }
  }

  openRegisterPopup() {
    this.isOpenSubject.next(true);
  }

  closeRegisterPopup() {
    this.isOpenSubject.next(false);
  }

  register(email: string, password: string, firstName: string, lastName: string, username: string) {
    this.httpClient.post<any>('http://localhost:3001/api/register', { email, password, firstName, lastName, username }).subscribe(
      (res) => {
        if (res.status === 200) {
          this.closeRegisterPopup();
          this.localStorageService.set('username', res.user.usuario);
          this.registerStatusSubject.next(true);
        } else {
          this.registerStatusSubject.next(false);
          alert('Error al registrar el usuario: ' + res.details);
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud de registro:', error);
        this.registerStatusSubject.next(false);
        alert('Error al realizar la solicitud de registro');
      }
    );
  }
}
