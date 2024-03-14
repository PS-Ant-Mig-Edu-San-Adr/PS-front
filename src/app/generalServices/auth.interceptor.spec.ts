import { TestBed, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SessionStorageService } from 'angular-web-storage';

// Mock del SessionStorageService
class MockSessionStorageService {
  get(key: string): any {
    // Aquí podrías devolver un valor fijo para simular un token
    return 'dummy_token';
  }
}

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Asegúrate de importar HttpClientModule
      providers: [
        HttpClient,
        { provide: SessionStorageService, useClass: MockSessionStorageService }, // Provee el mock del servicio
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]zº
    });
  });

  it('should be created', inject([HttpClient], (httpClient: HttpClient) => {
    expect(httpClient).toBeTruthy(); // Verifica que el HttpClient esté presente
    // Verifica que el interceptor esté registrado correctamente
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptors).toContain(jasmine.objectContaining({ useClass: AuthInterceptor }));
  }));
});
