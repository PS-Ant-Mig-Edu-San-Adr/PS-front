import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  openLoginPopup() {
    this.isOpenSubject.next(true);
  }

  closeLoginPopup() {
    this.isOpenSubject.next(false);
  }

  login(email: string, password: string) {
    this.httpClient.post<any>('http://localhost:3001/api/login', { email, password }).subscribe(
      (res) => {
        if (res.status === 200) {
          this.loginStatusSubject.next(true);
          this.closeLoginPopup();
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
}
