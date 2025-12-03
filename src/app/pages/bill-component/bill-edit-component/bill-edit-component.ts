import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';
import { Bill } from '../../../model/bill';
import { Booking } from '../../../model/booking';
import { BillService } from '../../../services/bill-service';
import { BookingService } from '../../../services/booking-service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-bill-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './bill-edit-component.html',
  styleUrls: ['./bill-edit-component.css']
})
export class BillEditComponent implements OnInit {
  form: FormGroup;
  bookings: Booking[] = [];
  paymentMethods: string[] = ['efectivo', 'tarjeta', 'transferencia', 'yape', 'plin'];
  states: string[] = ['pendiente', 'pagado', 'anulado'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Bill,
    private dialogRef: MatDialogRef<BillEditComponent>,
    private billService: BillService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    
    this.form = new FormGroup({
      idBill: new FormControl(this.data?.idBill),
      dateEmission: new FormControl(this.data?.dateEmission || new Date(), Validators.required),
      total: new FormControl(this.data?.total, [Validators.required, Validators.min(0)]),
      paymentMethod: new FormControl(this.data?.paymentMethod, Validators.required),
      state: new FormControl(this.data?.state || 'pendiente', Validators.required),
      booking: new FormControl(this.data?.booking, Validators.required)
    });
  }

  loadBookings(): void {
    this.bookingService.findAll().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log('Reservas cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  operate(): void {
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.value);
      console.log('Errores:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    const bill: Bill = {
      ...this.form.value,
      booking: this.bookings.find(b => b.idBooking === this.form.value.booking?.idBooking || b.idBooking === this.form.value.booking)
    };

    console.log('Factura a guardar:', bill);

    if (this.data?.idBill) {
      // Update
      this.billService.update(bill.idBill, bill).subscribe({
        next: () => {
          this.billService.setMessageChange('Factura actualizada correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al actualizar factura:', error);
          this.billService.setMessageChange('Error al actualizar factura');
        }
      });
    } else {
      // Create
      this.billService.save(bill).subscribe({
        next: () => {
          this.billService.setMessageChange('Factura creada correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al crear factura:', error);
          this.billService.setMessageChange('Error al crear factura');
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  compareBookings(b1: Booking, b2: Booking): boolean {
    return b1 && b2 ? b1.idBooking === b2.idBooking : b1 === b2;
  }
}
