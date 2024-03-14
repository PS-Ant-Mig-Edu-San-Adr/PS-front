import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  constructor(private httpClient: HttpClient) {}
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

  getFilteredNames(query: string) {

      return this.httpClient.get<any>(`http://localhost:3001/api/filterUser/${query}`).pipe(
          map((res: any) => { 
              if (res && res.status === 200) {
                  return res;
              } else {
                  return undefined;
              }
          }),
          catchError((error) => {
              console.error('Error al realizar la solicitud de añadir la imagen:', error);
              return of(undefined);
          })
      );
  }
}

