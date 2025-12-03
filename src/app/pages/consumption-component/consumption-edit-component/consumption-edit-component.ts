import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';
import { Consumption } from '../../../model/consumption';
import { Booking } from '../../../model/booking';
import { ServiceHotel } from '../../../model/serviceHotel';
import { ConsumptionService } from '../../../services/consumption-service';
import { BookingService } from '../../../services/booking-service';
import { ServiceHotelService } from '../../../services/serviceHotel-service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-consumption-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './consumption-edit-component.html',
  styleUrls: ['./consumption-edit-component.css']
})
export class ConsumptionEditComponent implements OnInit {
  form: FormGroup;
  bookings: Booking[] = [];
  services: ServiceHotel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Consumption,
    private dialogRef: MatDialogRef<ConsumptionEditComponent>,
    private consumptionService: ConsumptionService,
    private bookingService: BookingService,
    private serviceHotelService: ServiceHotelService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadServices();
    
    this.form = new FormGroup({
      idConsumption: new FormControl(this.data?.idConsumption),
      dateConsumption: new FormControl(this.data?.dateConsumption || new Date(), Validators.required),
      amount: new FormControl(this.data?.amount, [Validators.required, Validators.min(1)]),
      subtotal: new FormControl({ value: this.data?.subtotal || 0, disabled: true }),
      booking: new FormControl(this.data?.booking, Validators.required),
      serviceHotel: new FormControl(this.data?.serviceHotel, Validators.required)
    });

    // Calcular subtotal automáticamente cuando cambie la cantidad o el servicio
    this.form.get('amount')?.valueChanges.subscribe(() => this.calculateSubtotal());
    this.form.get('serviceHotel')?.valueChanges.subscribe(() => this.calculateSubtotal());
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

  loadServices(): void {
    this.serviceHotelService.findAll().subscribe({
      next: (data) => {
        this.services = data;
        console.log('Servicios cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  calculateSubtotal(): void {
    const amount = this.form.get('amount')?.value || 0;
    const serviceValue = this.form.get('serviceHotel')?.value;
    
    let selectedService: ServiceHotel | undefined;
    
    if (serviceValue) {
      selectedService = this.services.find(s => 
        s.idServiceHotel === serviceValue?.idServiceHotel || s.idServiceHotel === serviceValue
      );
    }

    const price = selectedService?.price || 0;
    const subtotal = amount * price;
    
    this.form.get('subtotal')?.setValue(subtotal);
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

    const formValue = this.form.getRawValue(); // getRawValue para incluir campos disabled

    const consumption: Consumption = {
      idConsumption: formValue.idConsumption,
      dateConsumption: formValue.dateConsumption,
      amount: formValue.amount,
      subtotal: formValue.subtotal,
      booking: this.bookings.find(b => b.idBooking === formValue.booking?.idBooking || b.idBooking === formValue.booking),
      serviceHotel: this.services.find(s => s.idServiceHotel === formValue.serviceHotel?.idServiceHotel || s.idServiceHotel === formValue.serviceHotel)
    };

    console.log('Consumo a guardar:', consumption);

    if (this.data?.idConsumption) {
      // Update
      this.consumptionService.update(consumption.idConsumption, consumption).subscribe({
        next: () => {
          this.consumptionService.setMessageChange('Consumo actualizado correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al actualizar consumo:', error);
          this.consumptionService.setMessageChange('Error al actualizar consumo');
        }
      });
    } else {
      // Create
      this.consumptionService.save(consumption).subscribe({
        next: () => {
          this.consumptionService.setMessageChange('Consumo creado correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al crear consumo:', error);
          this.consumptionService.setMessageChange('Error al crear consumo');
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

  compareServices(s1: ServiceHotel, s2: ServiceHotel): boolean {
    return s1 && s2 ? s1.idServiceHotel === s2.idServiceHotel : s1 === s2;
  }
}
