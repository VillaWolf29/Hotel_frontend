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
import { ServiceHotel } from '../../model/serviceHotel';
import { ServiceHotelService } from '../../services/serviceHotel-service';
import { ServiceEditComponent } from './service-edit-component/service-edit-component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-services',
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
    MatTooltipModule
  ],
  templateUrl: './service-component.html',
  styleUrls: ['./service-component.css']
})
export class ServicesComponent implements OnInit {
  displayedColumns: string[] = ['idServiceHotel', 'nameService', 'description', 'price', 'actions'];
  dataSource: MatTableDataSource<ServiceHotel>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private serviceHotelService: ServiceHotelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadServices();

    this.serviceHotelService.getServiceHotelChange().subscribe(data => {
      this.dataSource.data = data;
    });

    this.serviceHotelService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000 });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadServices() {
    console.log('Cargando servicios...');
    this.serviceHotelService.findAll().subscribe({
      next: (data) => {
        console.log('Servicios cargados:', data);
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        console.error('Detalles del error:', err.error);
        this.snackBar.open('Error al cargar servicios. Verifica la conexión con el backend.', 'ERROR', { duration: 5000 });
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

  openDialog(service?: ServiceHotel) {
    const dialogRef = this.dialog.open(ServiceEditComponent, {
      width: '600px',
      data: service,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
      }
    });
  }

  delete(service: ServiceHotel) {
    if (confirm(`¿Está seguro de eliminar el servicio ${service.nameService}?`)) {
      this.serviceHotelService.delete(service.idServiceHotel).subscribe({
        next: () => {
          this.serviceHotelService.setMessageChange('Servicio eliminado correctamente');
          this.loadServices();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.serviceHotelService.setMessageChange('Error al eliminar el servicio');
        }
      });
    }
  }
}
