import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Room } from '../../../app/model/room';
import { Booking } from '../../../app/model/booking';
import { Customer } from '../../../app/model/customer';
import { Employee } from '../../../app/model/employee';
import { BookingService } from '../../../app/services/booking-service';
import { CustomerService } from '../../../app/services/customer-service';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './booking-dialog-component.html',
  styleUrls: ['./booking-dialog-component.css']
})
export class BookingDialogComponent implements OnInit {
  bookingForm: FormGroup;
  totalDays: number = 0;
  totalPrice: number = 0;

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private customerService: CustomerService
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      idCard: ['', Validators.required],
      address: [''],
      checkInDate: [data.checkInDate || new Date(), Validators.required],
      checkOutDate: [data.checkOutDate || new Date(), Validators.required],
      numPeople: [data.numPeople || 2, Validators.required]
    });
  }

  ngOnInit(): void {
    this.calculateTotal();
    this.bookingForm.get('checkInDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.bookingForm.get('checkOutDate')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  calculateTotal(): void {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;
    
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalPrice = this.totalDays * this.data.room.price;
    }
  }

onSubmit(): void {
  if (this.bookingForm.valid) {
    const formValue = this.bookingForm.value;
    
    // Crear cliente
    const customer: Customer = {
      idCustomer: 0,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      idCard: formValue.idCard,
      address: formValue.address
    };

    // Crear un empleado por defecto (puedes cambiarlo según tu lógica)
    const employee: Employee = {
      idEmpleado: 1, // ID del empleado que procesa la reserva
      firstName: 'Sistema',
      lastName: 'Automatico',
      post: 'Recepcionista',
      phone: '',
      email: ''
    };

    // Crear reserva con los atributos CORRECTOS
    const booking: Booking = {
      idBooking: 0,
      dateBooking: new Date(), // Fecha actual de la reserva
      dateCheckIn: formValue.checkInDate, // Fecha de entrada
      dateCheckOut: formValue.checkOutDate, // Fecha de salida
      state: 'Confirmada',
      customer: customer,
      room: this.data.room,
      employee: employee // Empleado que procesa
    };

    // Primero guardar el cliente
    this.customerService.save(customer).subscribe({
      next: (savedCustomer: any) => {
        booking.customer = savedCustomer;
        // Luego guardar la reserva
        this.bookingService.save(booking).subscribe({
          next: (savedBooking: any) => {
            this.dialogRef.close(savedBooking);
          },
          error: (err) => console.error('Error creating booking', err)
        });
      },
      error: (err) => console.error('Error creating customer', err)
    });
  }
}
  onCancel(): void {
    this.dialogRef.close();
  }
}