import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Room } from '../../model/room';
import { RoomService } from '../../services/room-service';
import { RoomEditComponent } from './room-edit-component/room-edit-component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './room-component.html',
  styleUrls: ['./room-component.css']
})
export class RoomsComponent implements OnInit {
  displayedColumns: string[] = ['idRoom', 'numRoom', 'type', 'ability', 'price', 'state', 'actions'];
  dataSource: MatTableDataSource<Room>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadRooms();

    this.roomService.getRoomChange().subscribe(data => {
      this.dataSource.data = data;
    });

    this.roomService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000 });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRooms() {
    this.roomService.findAll().subscribe({
      next: (data) => {
        console.log('Habitaciones cargadas:', data);
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.snackBar.open('Error al cargar habitaciones. Verifica que el backend esté corriendo.', 'ERROR', { duration: 5000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(room?: Room) {
    const dialogRef = this.dialog.open(RoomEditComponent, {
      width: '600px',
      data: room,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // Recargar la lista después de cerrar el diálogo
      this.loadRooms();
    });
  }

  delete(room: Room) {
    if (confirm(`¿Está seguro de eliminar la habitación ${room.numRoom}?`)) {
      this.roomService.delete(room.idRoom).pipe(
        switchMap(() => this.roomService.findAll())
      ).subscribe({
        next: (data) => {
          this.roomService.setRoomChange(data);
          this.roomService.setMessageChange('Habitación eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.roomService.setMessageChange('Error al eliminar la habitación');
        }
      });
    }
  }
}
