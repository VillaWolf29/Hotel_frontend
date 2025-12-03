import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../../model/customer';
import { CustomerService } from '../../../services/customer-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-edit',
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
  templateUrl: './customer-edit-component.html',
  styleUrls: ['./customer-edit-component.css']
})
export class CustomerEditComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Customer
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data != null;
    
    this.form = this.fb.group({
      idCustomer: [this.data?.idCustomer],
      firstName: [this.data?.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.data?.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.data?.email, [Validators.required, Validators.email]],
      phone: [this.data?.phone, [Validators.required, Validators.minLength(9)]],
      idCard: [this.data?.idCard, [Validators.required, Validators.minLength(8)]],
      address: [this.data?.address, [Validators.required, Validators.minLength(5)]]
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const customer: Customer = this.form.value;

    if (this.isEdit) {
      // Update
      this.customerService.update(customer.idCustomer, customer).pipe(
        switchMap(() => this.customerService.findAll())
      ).subscribe({
        next: (data) => {
          this.customerService.setCustomerChange(data);
          this.customerService.setMessageChange('Cliente actualizado correctamente');
          this.close();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.customerService.setMessageChange('Error al actualizar el cliente');
        }
      });
    } else {
      // Create
      this.customerService.save(customer).pipe(
        switchMap(() => this.customerService.findAll())
      ).subscribe({
        next: (data) => {
          this.customerService.setCustomerChange(data);
          this.customerService.setMessageChange('Cliente registrado correctamente');
          this.close();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.customerService.setMessageChange('Error al guardar el cliente');
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
