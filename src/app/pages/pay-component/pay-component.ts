import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pay } from '../../model/pay';
import { PayService } from '../../services/pay-service';
import { PayEditComponent } from './pay-edit-component/pay-edit-component';
import { MaterialModule } from '../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './pay-component.html',
  styleUrls: ['./pay-component.css']
})
export class PayComponent implements OnInit {
  displayedColumns: string[] = ['idPay', 'datePay', 'amount', 'paymentMethod', 'bill', 'actions'];
  dataSource: MatTableDataSource<Pay>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private payService: PayService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.payService.getPayChange().subscribe(data => {
      this.createTable(data);
    });

    this.payService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'right' });
    });

    this.loadPays();
  }

  loadPays(): void {
    console.log('Cargando pagos...');
    this.payService.findAll().subscribe({
      next: (data) => {
        console.log('Pagos cargados:', data);
        this.createTable(data);
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
        this.snackBar.open('Error al cargar pagos', 'ERROR', { duration: 3000 });
      }
    });
  }

  createTable(data: Pay[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(pay?: Pay): void {
    const dialogRef = this.dialog.open(PayEditComponent, {
      width: '600px',
      data: pay,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPays();
    });
  }

  delete(pay: Pay): void {
    if (confirm(`¿Está seguro de eliminar el pago #${pay.idPay}?`)) {
      this.payService.delete(pay.idPay).subscribe({
        next: () => {
          this.payService.setMessageChange('Pago eliminado correctamente');
          this.loadPays();
        },
        error: (error) => {
          console.error('Error al eliminar pago:', error);
          this.snackBar.open('Error al eliminar pago', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}
