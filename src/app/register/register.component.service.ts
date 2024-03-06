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
    const isRegisterSuccessful = true;
    console.log('Register successful: ', isRegisterSuccessful);
    this.registerStatusSubject.next(isRegisterSuccessful);

    if (isRegisterSuccessful) {
      this.closeRegisterPopup();
    }
  }
}
