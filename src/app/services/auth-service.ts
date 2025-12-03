import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtRequest, JwtResponse, AuthUser, CustomerRequest, CustomerResponse } from '../model/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.HOST}/login`;
  private customersUrl = `${environment.HOST}/customers`;
  
  // Señal para monitorear si el usuario está autenticado
  isAuthenticated = signal(this.hasToken());
  
  // Sujeto para el usuario autenticado actual
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay token almacenado al inicializar
    this.checkToken();
  }

  /**
   * Realiza el login con username y password
   * @param jwtRequest Credenciales del usuario
   * @returns Observable con la respuesta del login
   */
  login(jwtRequest: JwtRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiUrl, jwtRequest).pipe(
      tap((response) => {
        // Almacenar token en localStorage
        this.setToken(response.access_token);
        
        // Extraer username del JWT y actualizar usuario actual
        const username = this.extractUsernameFromToken(response.access_token);
        const authUser: AuthUser = {
          username: username,
          token: response.access_token
        };
        this.currentUserSubject.next(authUser);
        this.setUserToStorage(authUser);
        
        // Actualizar señal de autenticación
        this.isAuthenticated.set(true);
      })
    );
  }

  /**
   * Registra un nuevo cliente
   * POST /customers - Backend sin JWT requerido
   * @param customerRequest Datos del nuevo cliente
   * @returns Observable con la respuesta del registro
   */
  register(customerRequest: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.customersUrl, customerRequest).pipe(
      tap((response) => {
        console.log('✅ Cliente registrado exitosamente:', response.firstName, response.lastName);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Actualizar observables
    this.currentUserSubject.next(null);
    
    // Actualizar señal de autenticación
    this.isAuthenticated.set(false);
  }

  /**
   * Obtiene el token almacenado
   * @returns Token JWT o null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Almacena el token en localStorage
   * @param token Token JWT a almacenar
   */
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Verifica si existe un token válido
   * @returns true si hay token y no está expirado
   */
  hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = this.parseJwt(token);
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Verifica si el token es válido al iniciar la aplicación
   */
  private checkToken(): void {
    if (this.hasToken()) {
      this.isAuthenticated.set(true);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns Usuario autenticado o null
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Extrae el username del token JWT
   * @param token Token JWT
   * @returns Username extraído del token
   */
  private extractUsernameFromToken(token: string): string {
    try {
      const payload = this.parseJwt(token);
      return payload.sub || '';
    } catch {
      return '';
    }
  }

  /**
   * Decodifica un JWT y obtiene el payload
   * @param token Token JWT
   * @returns Payload decodificado
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  /**
   * Almacena el usuario en localStorage
   * @param user Usuario a almacenar
   */
  private setUserToStorage(user: AuthUser): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  /**
   * Obtiene el usuario desde localStorage
   * @returns Usuario almacenado o null
   */
  private getUserFromStorage(): AuthUser | null {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }
}
