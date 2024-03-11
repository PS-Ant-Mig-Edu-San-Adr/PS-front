import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../generalServices/auth.interceptor'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule  // Importar el módulo HttpClientModule para poder utilizar HTTP_INTERCEPTORS
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class HomeModule { }
