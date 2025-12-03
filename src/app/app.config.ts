import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth-service';

import { routes } from './app.routes';

/**
 * Interceptor HTTP para agregar headers globales y token de autenticación
 * - Configura Content-Type automáticamente
 * - Agrega token JWT al header Authorization si existe
 * - Maneja peticiones HTTP de forma centralizada
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    }
  });

  // Agregar token al header si existe
  if (token && !req.url.includes('/login')) {
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

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
