import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
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

  login() {
    const isLoginSuccessful = true;
    console.log('Login successful: ', isLoginSuccessful);
    this.loginStatusSubject.next(isLoginSuccessful);

    if (isLoginSuccessful) {
      this.closeLoginPopup();
    }
  }
}
