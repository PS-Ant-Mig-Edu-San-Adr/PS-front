import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AddReminderService {
  constructor(private httpClient: HttpClient) {}
  private reminderAddedSubject = new BehaviorSubject<boolean>(false);
  reminderAdded$ = this.reminderAddedSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private manageMembersStatusSubject = new BehaviorSubject<boolean>(false);
  manageMembersStatus$ = this.manageMembersStatusSubject.asObservable();

  private dateSubject = new BehaviorSubject<string | undefined>(undefined);
  date$ = this.dateSubject.asObservable();

  openAddReminderPopup(date: string) {
    this.isOpenSubject.next(true);
    this.dateSubject.next(date);
  }

  openEditReminderPopup() {
    this.isOpenSubject.next(true);
  }



  closeAddReminderPopup() {
    this.isOpenSubject.next(false);
    this.dateSubject.next(undefined);
  }

  updateReminder(selectedDateStart: string, selectedDateEnd: string, selectedRepeat: string, selectedTitle: string, selectedColor: string, selectedDescription: string, username: string, id: string) {
    const body = {
      selectedDateStart,
      selectedDateEnd,
      selectedRepeat,
      selectedTitle,
      selectedColor,
      selectedDescription,
    };

    this.httpClient
      .put<any>(`http://localhost:3001/api/recordatorios/${username}/${id}`, body)
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.closeAddReminderPopup();
            this.reminderAddedSubject.next(true);
            setTimeout(() => this.reminderAddedSubject.next(false), 0);
          } else {
            alert('Error al actualizar el recordatorio: ' + res.details);
          }
        },
        (error) => {
          console.error('Error al realizar la solicitud de actualizar recordatorio:', error);
          alert('Error al realizar la solicitud de actualizar recordatorio');
        }
      );
  }

  addReminder(selectedDateStart: string, selectedDateEnd: string, selectedRepeat: string, selectedTitle: string, selectedColor: string, selectedDescription: string ,username: string){

    const body = {
        selectedDateStart,
        selectedDateEnd,
        selectedRepeat,
        selectedTitle,
        selectedColor,
        selectedDescription
    };

    this.httpClient.post<any>(`http://localhost:3001/api/recordatorios/${username}`, body).subscribe(
      (res) => {
        if (res.status === 201) {
          this.closeAddReminderPopup();
          this.reminderAddedSubject.next(true);
          setTimeout(() => this.reminderAddedSubject.next(false), 0);
        } else {
          alert('Error al añadir el recordatorio: ' + res.details);
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud de añadir recordatorio:', error);
        alert('Error al realizar la solicitud de añadir recordatorio');
      }
    );
  }
}
