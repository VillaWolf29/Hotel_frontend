import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../model/employee';
import { EmployeeService } from '../../../services/employee-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-edit-component.html',
  styleUrls: ['./employee-edit-component.css']
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Employee
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data != null;
    
    this.form = this.fb.group({
      idEmpleado: [this.data?.idEmpleado],
      firstName: [this.data?.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.data?.lastName, [Validators.required, Validators.minLength(2)]],
      post: [this.data?.post, [Validators.required, Validators.minLength(2)]],
      phone: [this.data?.phone, [Validators.required, Validators.minLength(9)]],
      email: [this.data?.email, [Validators.required, Validators.email]]
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const employee: Employee = this.form.value;

    if (this.isEdit) {
      // Update
      this.employeeService.update(employee.idEmpleado, employee).pipe(
        switchMap(() => this.employeeService.findAll())
      ).subscribe({
        next: (data) => {
          this.employeeService.setEmployeeChange(data);
          this.employeeService.setMessageChange('Empleado actualizado correctamente');
          this.close();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.employeeService.setMessageChange('Error al actualizar el empleado');
        }
      });
    } else {
      // Create
      this.employeeService.save(employee).pipe(
        switchMap(() => this.employeeService.findAll())
      ).subscribe({
        next: (data) => {
          this.employeeService.setEmployeeChange(data);
          this.employeeService.setMessageChange('Empleado registrado correctamente');
          this.close();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.employeeService.setMessageChange('Error al guardar el empleado');
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    
    return '';
  }
}