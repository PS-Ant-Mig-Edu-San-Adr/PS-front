import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/interface';
import { SessionStorageService } from 'angular-web-storage';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PerfilInfoService {
    constructor(private httpClient: HttpClient, private sessionStorageService: SessionStorageService) {}
    
    addImage(file: File): Observable<any> {
        const image = new FormData();
        image.append('file', file);

        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'multipart/form-data'
        });

        return this.httpClient.post<any>(`http://localhost:3001/api/image`, image).pipe(
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

    putUser(username: string, inputUserName: string, inputEmail: string, inputZone: string, inputPassword: string, file: File | undefined): Observable<any> {
        const body = {
            inputUsername: inputUserName,
            email: inputEmail,
            timeZone: inputZone,
            password: inputPassword,
            fileName: null
        };
    
        return file ? 
            this.addImage(file).pipe(
                switchMap((res) => {
                    if (res.status === 200) {
                        body.fileName = res.name;
                    }
                    return this.modifyUser(body, username);
                }),
                switchMap((res) => {
                    if (res.status === 200) {
                        this.sessionStorageService.set('username', body.inputUsername);
                        this.sessionStorageService.set('profilePict', res.user.avatar);
                        return of(res);
                    }
                    return of(undefined);
                })
            ) :
            this.modifyUser(body, username).pipe(
                switchMap((res) => {
                    if (res.status === 200) {
                        this.sessionStorageService.set('username', body.inputUsername);
                    }
                    return of(res);
                })
            );
    }

    modifyUser(body: any, username: String): Observable<any> {
        return this.httpClient.put<any>(`http://localhost:3001/api/user/${username}`, body).pipe(
            map((res) => {
                if (res.status === 200) {
                    this.sessionStorageService.set('username', body.inputUsername);
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
