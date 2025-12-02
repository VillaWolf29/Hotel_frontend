import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Room } from '../../model/room';
import { RoomService } from '../../services/room-service';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog-component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  
  // Filtros
  searchLocation: string = 'Solo, Cuenca';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  numPeople: number = 2;
  
  // Filtros laterales
  selectedTypes: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 500;
  roomTypes: string[] = ['Individual', 'Doble', 'Suite', 'Matrimonial'];
  
  constructor(
    private roomService: RoomService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.findAll().subscribe({
      next: (data) => {
        this.rooms = data;
        this.filteredRooms = data;
      },
      error: (err) => console.error('Error loading rooms', err)
    });
  }

  searchRooms(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const matchesType = this.selectedTypes.length === 0 || this.selectedTypes.includes(room.type);
      const matchesPrice = room.price >= this.minPrice && room.price <= this.maxPrice;
      const matchesAvailability = room.state === true;
      return matchesType && matchesPrice && matchesAvailability;
    });
  }

  onTypeChange(type: string, checked: boolean): void {
    if (checked) {
      this.selectedTypes.push(type);
    } else {
      const index = this.selectedTypes.indexOf(type);
      if (index > -1) {
        this.selectedTypes.splice(index, 1);
      }
    }
    this.searchRooms();
  }

  openBookingDialog(room: Room): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '600px',
      data: { 
        room, 
        checkInDate: this.checkInDate, 
        checkOutDate: this.checkOutDate,
        numPeople: this.numPeople
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking confirmed:', result);
        // Aquí puedes llamar al servicio de booking
      }
    });
  }
}