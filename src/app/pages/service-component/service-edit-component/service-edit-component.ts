import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ServiceHotel } from '../../../model/serviceHotel';
import { ServiceHotelService } from '../../../services/serviceHotel-service';

@Component({
  selector: 'app-service-edit',
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
  templateUrl: './service-edit-component.html',
  styleUrls: ['./service-edit-component.css']
})
export class ServiceEditComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private serviceHotelService: ServiceHotelService,
    private dialogRef: MatDialogRef<ServiceEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ServiceHotel
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data != null;
    
    this.form = this.fb.group({
      idServiceHotel: [this.data?.idServiceHotel],
      nameService: [this.data?.nameService, [Validators.required, Validators.minLength(3)]],
      description: [this.data?.description, [Validators.required, Validators.minLength(10)]],
      price: [this.data?.price, [Validators.required, Validators.min(0)]]
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Formulario inválido');
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    const service: ServiceHotel = this.form.value;
    console.log('Datos a enviar:', service);

    if (this.isEdit) {
      // Update
      this.serviceHotelService.update(service.idServiceHotel, service).subscribe({
        next: (response) => {
          console.log('Servicio actualizado:', response);
          this.serviceHotelService.setMessageChange('Servicio actualizado correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          console.error('Detalles del error:', err.error);
          this.serviceHotelService.setMessageChange('Error al actualizar el servicio: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Create
      this.serviceHotelService.save(service).subscribe({
        next: (response) => {
          console.log('Servicio creado:', response);
          this.serviceHotelService.setMessageChange('Servicio registrado correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          console.error('Detalles del error:', err.error);
          this.serviceHotelService.setMessageChange('Error al guardar el servicio: ' + (err.error?.message || err.message));
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
    
    if (control?.hasError('min')) {
      return 'El precio debe ser mayor o igual a 0';
    }
    
    return '';
  }
}
