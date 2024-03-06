import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiClientService } from '../generalServices/api-client.js.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  constructor(private apiClientService: ApiClientService) {}

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private registerStatusSubject = new BehaviorSubject<boolean>(false);
  registerStatus$ = this.registerStatusSubject.asObservable();

  async checkUsername(username: string): Promise<boolean> {
    var result = await this.apiClientService.checkUsername(username);
    if (result.status === 200) {
      return true;
    } else {
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
    this.apiClientService.register(email, password, firstName, lastName, username).then((res) => {
      if (res.status === 200) {
        this.registerStatusSubject.next(true);
        this.closeRegisterPopup();
      } else {
        this.registerStatusSubject.next(false);
        alert('Error al registrar el usuario: ' + res.details);
      }
    });
  }
}
