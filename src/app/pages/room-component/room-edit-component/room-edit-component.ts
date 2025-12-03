import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Room } from '../../../model/room';
import { RoomService } from '../../../services/room-service';

@Component({
  selector: 'app-room-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './room-edit-component.html',
  styleUrls: ['./room-edit-component.css']
})
export class RoomEditComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  
  roomTypes: string[] = ['individual', 'doble', 'suite', 'familiar', 'triple', 'matrimonial'];
  capacities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private dialogRef: MatDialogRef<RoomEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Room
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data != null;
    
    this.form = this.fb.group({
      idRoom: [this.data?.idRoom],
      numRoom: [this.data?.numRoom, [Validators.required, Validators.min(1)]],
      type: [this.data?.type?.toLowerCase(), [Validators.required]],
      ability: [this.data?.ability, [Validators.required, Validators.min(1), Validators.max(10)]],
      price: [this.data?.price, [Validators.required, Validators.min(0)]],
      state: [this.data?.state ?? true]
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Formulario inválido:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    const room: Room = this.form.value;
    console.log('Datos a enviar:', room);

    if (this.isEdit) {
      // Update
      this.roomService.update(room.idRoom, room).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor (actualizar):', response);
          this.roomService.setMessageChange('Habitación actualizada correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.roomService.setMessageChange('Error al actualizar la habitación: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Create
      this.roomService.save(room).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor (crear):', response);
          this.roomService.setMessageChange('Habitación registrada correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          console.error('Detalles del error:', err.error);
          this.roomService.setMessageChange('Error al guardar la habitación: ' + (err.error?.message || err.message));
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
    
    if (control?.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `El valor mínimo es ${min}`;
    }
    
    return '';
  }
}
