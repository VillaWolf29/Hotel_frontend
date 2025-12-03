import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Guard de autenticación que protege las rutas
 * Solo permite acceso si el usuario tiene un token válido
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.hasToken()) {
      return true;
    }

    // Redirigir a login si no está autenticado
    this.router.navigate(['/login']);
    return false;
  }
}

/**
 * Función guard para usar en las rutas
 * Uso: { path: 'rooms', component: RoomsComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasToken()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
