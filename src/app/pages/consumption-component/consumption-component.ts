import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consumption } from '../../model/consumption';
import { ConsumptionService } from '../../services/consumption-service';
import { ConsumptionEditComponent } from './consumption-edit-component/consumption-edit-component';
import { MaterialModule } from '../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consumption',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './consumption-component.html',
  styleUrls: ['./consumption-component.css']
})
export class ConsumptionComponent implements OnInit {
  displayedColumns: string[] = ['idConsumption', 'dateConsumption', 'serviceHotel', 'amount', 'subtotal', 'booking', 'actions'];
  dataSource: MatTableDataSource<Consumption>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private consumptionService: ConsumptionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.consumptionService.getConsumptionChange().subscribe(data => {
      this.createTable(data);
    });

    this.consumptionService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'right' });
    });

    this.loadConsumptions();
  }

  loadConsumptions(): void {
    console.log('Cargando consumos...');
    this.consumptionService.findAll().subscribe({
      next: (data) => {
        console.log('Consumos cargados:', data);
        this.createTable(data);
      },
      error: (error) => {
        console.error('Error al cargar consumos:', error);
        this.snackBar.open('Error al cargar consumos', 'ERROR', { duration: 3000 });
      }
    });
  }

  createTable(data: Consumption[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(consumption?: Consumption): void {
    const dialogRef = this.dialog.open(ConsumptionEditComponent, {
      width: '600px',
      data: consumption,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadConsumptions();
    });
  }

  delete(consumption: Consumption): void {
    if (confirm(`¿Está seguro de eliminar el consumo #${consumption.idConsumption}?`)) {
      this.consumptionService.delete(consumption.idConsumption).subscribe({
        next: () => {
          this.consumptionService.setMessageChange('Consumo eliminado correctamente');
          this.loadConsumptions();
        },
        error: (error) => {
          console.error('Error al eliminar consumo:', error);
          this.snackBar.open('Error al eliminar consumo', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}
