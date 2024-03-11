import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupAddPopUpService {

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private manageMembersStatusSubject = new BehaviorSubject<boolean>(false);
  manageMembersStatus$ = this.manageMembersStatusSubject.asObservable();

  openGroupAddPopup() {
    this.isOpenSubject.next(true);
  }

  closeGroupAddPopup() {
    this.isOpenSubject.next(false);
  }
}
