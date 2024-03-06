import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiClientService } from '../generalServices/api-client.js.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apiClientService: ApiClientService) {}
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
    this.apiClientService.login(email, password).then((res) => {
      if (res.status === 200) {
        this.loginStatusSubject.next(true);
        this.closeLoginPopup();
      } else {
        this.loginStatusSubject.next(false);
        alert('Error al loggearse: ' + res.details);
      }
    });
  }
}
