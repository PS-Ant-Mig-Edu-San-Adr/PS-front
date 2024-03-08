import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiClientService } from '../generalServices/api-client.js.service';

@Injectable({
  providedIn: 'root',
})
export class AddReminderService {
  constructor(private apiClientService: ApiClientService) {}
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private manageMembersStatusSubject = new BehaviorSubject<boolean>(false);
  manageMembersStatus$ = this.manageMembersStatusSubject.asObservable();

  openAddReminderPopup() {
    this.isOpenSubject.next(true);
  }

  closeAddReminderPopup() {
    this.isOpenSubject.next(false);
  }
}
