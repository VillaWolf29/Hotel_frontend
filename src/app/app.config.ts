import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration, HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Interceptor HTTP para agregar headers globales
 * - Configura Content-Type automáticamente
 * - Prepara para agregar tokens de autenticación
 * - Maneja peticiones HTTP de forma centralizada
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    }
  });
  return next(clonedRequest);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // HttpClient con interceptors configurados
    provideHttpClient(
      withInterceptors([httpInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    
    {
      provide: 'API_URL',
      useValue: 'http://localhost:8080/api'
    }
  ]
};
