import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('🏨 Hotel Cuenca');
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser$;

  ngOnInit(): void {
    // La autenticación se maneja automáticamente en el servicio
  }

  /**
   * Realiza logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el nombre del usuario actual
   */
  getCurrentUsername(): string {
    return this.authService.getCurrentUser()?.username || 'Usuario';
  }
}
