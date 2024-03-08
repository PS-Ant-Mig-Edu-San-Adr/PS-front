import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiClientService } from '../generalServices/api-client.js.service';

@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  constructor(private apiClientService: ApiClientService) {}
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private manageMembersStatusSubject = new BehaviorSubject<boolean>(false);
  manageMembersStatus$ = this.manageMembersStatusSubject.asObservable();

  openManageMembersPopup() {
    this.isOpenSubject.next(true);
  }

  closeManageMembersPopup() {
    this.isOpenSubject.next(false);
  }
}
