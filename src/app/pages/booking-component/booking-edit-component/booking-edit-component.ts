import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';
import { Booking } from '../../../model/booking';
import { Customer } from '../../../model/customer';
import { Room } from '../../../model/room';
import { Employee } from '../../../model/employee';
import { BookingService } from '../../../services/booking-service';
import { CustomerService } from '../../../services/customer-service';
import { RoomService } from '../../../services/room-service';
import { EmployeeService } from '../../../services/employee-service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './booking-edit-component.html',
  styleUrls: ['./booking-edit-component.css']
})
export class BookingEditComponent implements OnInit {
  form: FormGroup;
  customers: Customer[] = [];
  rooms: Room[] = [];
  employees: Employee[] = [];
  states: string[] = ['reservado', 'checkin', 'checkout', 'cancelado'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Booking,
    private dialogRef: MatDialogRef<BookingEditComponent>,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private roomService: RoomService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadRooms();
    this.loadEmployees();
    
    this.form = new FormGroup({
      idBooking: new FormControl(this.data?.idBooking),
      dateBooking: new FormControl(this.data?.dateBooking || new Date(), Validators.required),
      dateCheckIn: new FormControl(this.data?.dateCheckIn, Validators.required),
      dateCheckOut: new FormControl(this.data?.dateCheckOut, Validators.required),
      state: new FormControl(this.data?.state || 'reservado', Validators.required),
      customer: new FormControl(this.data?.customer, Validators.required),
      room: new FormControl(this.data?.room, Validators.required),
      employee: new FormControl(this.data?.employee, Validators.required)
    });
  }

  loadCustomers(): void {
    this.customerService.findAll().subscribe({
      next: (data) => {
        this.customers = data;
        console.log('Clientes cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  loadRooms(): void {
    this.roomService.findAll().subscribe({
      next: (data) => {
        this.rooms = data;
        console.log('Habitaciones cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.findAll().subscribe({
      next: (data) => {
        this.employees = data;
        console.log('Empleados cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
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

    const formValue = this.form.value;
    const selectedCustomer = this.customers.find(c => c.idCustomer === formValue.customer?.idCustomer || c.idCustomer === formValue.customer);
    const selectedRoom = this.rooms.find(r => r.idRoom === formValue.room?.idRoom || r.idRoom === formValue.room);
    const selectedEmployee = this.employees.find(e => e.idEmpleado === formValue.employee?.idEmpleado || e.idEmpleado === formValue.employee);

    const booking: Booking = {
      idBooking: formValue.idBooking,
      dateBooking: formValue.dateBooking,
      dateCheckIn: formValue.dateCheckIn,
      dateCheckOut: formValue.dateCheckOut,
      state: formValue.state,
      customer: selectedCustomer,
      room: selectedRoom,
      employee: selectedEmployee
    };

    console.log('Reserva a guardar:', JSON.stringify(booking, null, 2));
    console.log('Cliente seleccionado:', selectedCustomer);
    console.log('Habitación seleccionada:', selectedRoom);
    console.log('Empleado seleccionado:', selectedEmployee);

    if (this.data?.idBooking) {
      // Update
      this.bookingService.update(booking.idBooking, booking).subscribe({
        next: () => {
          this.bookingService.setMessageChange('Reserva actualizada correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error completo al actualizar reserva:', error);
          console.error('Mensaje de error:', error.error);
          console.error('Estado:', error.status);
          this.bookingService.setMessageChange('Error al actualizar reserva: ' + (error.error?.message || error.message));
        }
      });
    } else {
      // Create
      this.bookingService.save(booking).subscribe({
        next: () => {
          this.bookingService.setMessageChange('Reserva creada correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error completo al crear reserva:', error);
          console.error('Mensaje de error:', error.error);
          console.error('Estado:', error.status);
          this.bookingService.setMessageChange('Error al crear reserva: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  compareCustomers(c1: Customer, c2: Customer): boolean {
    return c1 && c2 ? c1.idCustomer === c2.idCustomer : c1 === c2;
  }

  compareRooms(r1: Room, r2: Room): boolean {
    return r1 && r2 ? r1.idRoom === r2.idRoom : r1 === r2;
  }

  compareEmployees(e1: Employee, e2: Employee): boolean {
    return e1 && e2 ? e1.idEmpleado === e2.idEmpleado : e1 === e2;
  }
}
