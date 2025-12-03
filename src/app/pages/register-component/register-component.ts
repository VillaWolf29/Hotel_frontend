import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth-service';
import { CustomerRequest } from '../../model/login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  registerForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
    
    // Redirigir a home si ya está autenticado
    if (this.authService.hasToken()) {
      this.router.navigate(['/home']);
      return;
    }
  }

  /**
   * Inicializa el formulario de registro
   */
  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      idCard: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', [Validators.maxLength(100)]],
    });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    return null; // Ya no necesario con nuevo flujo
  }

  /**
   * Valida si el campo tiene error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    return '';
  }

  /**
   * Obtiene la etiqueta del campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'firstName': 'Nombre',
      'lastName': 'Apellido',
      'email': 'Email',
      'phone': 'Teléfono',
      'idCard': 'Cédula de Identidad',
      'address': 'Dirección'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    if (!this.registerForm.valid) {
      this.snackBar.open('Por favor completa todos los campos correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.value;
    
    const customerRequest: CustomerRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      idCard: formValue.idCard,
      address: formValue.address || ''
    };

    this.authService.register(customerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('✅ ¡Cliente registrado exitosamente! El administrador debe crear tus credenciales de acceso.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        // Limpiar formulario
        this.registerForm.reset();
        
        // Redirigir a login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'Error al registrar cliente';
        
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Datos inválidos. Verifica teléfono (9 dígitos) y cédula (8 dígitos)';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión con el servidor';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        
        console.error('Error de registro:', error);
      }
    });
  }

  /**
   * Navega de vuelta al login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
