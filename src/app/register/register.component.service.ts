import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private registerStatusSubject = new BehaviorSubject<boolean>(false);
  registerStatus$ = this.registerStatusSubject.asObservable();

  openRegisterPopup() {
    this.isOpenSubject.next(true);
  }

  closeRegisterPopup() {
    this.isOpenSubject.next(false);
  }

  register() {
    const isLoginSuccessful = true;
    console.log('Register successful: ', isLoginSuccessful);
    this.registerStatusSubject.next(isLoginSuccessful);

    if (isLoginSuccessful) {
      this.closeRegisterPopup();
    }
  }
}
