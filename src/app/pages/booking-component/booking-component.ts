import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking } from '../../model/booking';
import { BookingService } from '../../services/booking-service';
import { BookingEditComponent } from './booking-edit-component/booking-edit-component';
import { MaterialModule } from '../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './booking-component.html',
  styleUrls: ['./booking-component.css']
})
export class BookingComponent implements OnInit {
  displayedColumns: string[] = ['idBooking', 'dateBooking', 'customer', 'room', 'dateCheckIn', 'dateCheckOut', 'state', 'employee', 'actions'];
  dataSource: MatTableDataSource<Booking>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingService.getBookingChange().subscribe(data => {
      this.createTable(data);
    });

    this.bookingService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'right' });
    });

    this.loadBookings();
  }

  loadBookings(): void {
    console.log('Cargando reservas...');
    this.bookingService.findAll().subscribe({
      next: (data) => {
        console.log('Reservas cargadas:', data);
        this.createTable(data);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.snackBar.open('Error al cargar reservas', 'ERROR', { duration: 3000 });
      }
    });
  }

  createTable(data: Booking[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(booking?: Booking): void {
    const dialogRef = this.dialog.open(BookingEditComponent, {
      width: '700px',
      data: booking,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBookings();
    });
  }

  delete(booking: Booking): void {
    if (confirm(`¿Está seguro de eliminar la reserva #${booking.idBooking}?`)) {
      this.bookingService.delete(booking.idBooking).subscribe({
        next: () => {
          this.bookingService.setMessageChange('Reserva eliminada correctamente');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error al eliminar reserva:', error);
          this.snackBar.open('Error al eliminar reserva', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}
