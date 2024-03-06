// login.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  openLoginPopup() {
    this.isOpenSubject.next(true);
  }

  closeLoginPopup() {
    this.isOpenSubject.next(false);
  }
}
