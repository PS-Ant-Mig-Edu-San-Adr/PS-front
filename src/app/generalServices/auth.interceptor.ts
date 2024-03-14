import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionStorageService: SessionStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token del almacenamiento de sesión
    const token = this.sessionStorageService.get('token');
    console.log("Token: ", token);

    // Clonar la solicitud y agregar el token al encabezado de autorización si está presente
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    // Si no hay token, continuar con la solicitud original
    return next.handle(req);
  }
}
