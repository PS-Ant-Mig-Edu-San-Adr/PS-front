import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/interface';
import { SessionStorageService } from 'angular-web-storage';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PerfilNotificactionService {
    constructor(private httpClient: HttpClient, private sessionStorageService: SessionStorageService) {}

    getUser(username: string): Observable<User | undefined> {
        return this.httpClient.get<any>(`http://localhost:3001/api/searchUser/${username}`, { params: { username } }).pipe(
            map((res) => {
                if (res.status === 200) {
                    return res.user;
                } else {
                    return undefined;
                }
            }),
            catchError((error) => {
                console.error('Error al realizar la solicitud de obtener el usuario:', error);
                return of(undefined);
            })
        );
    }

    putUser(notificationsOption: string, username: string): Observable<boolean> {
        const body = {
            notificationsOption: notificationsOption
        };
        return this.modifyUserNotifications(body, username).pipe(
            switchMap((res) => {
                if (res.status === 200) {
                    return of(true);
                }
                return of(false);
            })
        );
    }

    modifyUserNotifications(body: any, username: string): Observable<any> {
        return this.httpClient.put<any>(`http://localhost:3001/api/userNotificactions/${username}`, body).pipe(
            map((res) => {
                if (res.status === 200) {
                    return res;
                } else {
                    return res;
                }
            }),
            catchError((error) => {
                console.error('Error al realizar la solicitud de modificar el usuario:', error);
                return of(undefined);
            })
        );
    }
}
