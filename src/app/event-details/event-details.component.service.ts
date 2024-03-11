import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventDetailsService {

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  openEventDetailsPopup() {
    this.isOpenSubject.next(true);
  }

  closeEventDetailsPopup() {
    this.isOpenSubject.next(false);
  }


}
