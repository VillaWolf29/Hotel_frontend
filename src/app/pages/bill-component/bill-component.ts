import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Bill } from '../../model/bill';
import { BillService } from '../../services/bill-service';
import { BillEditComponent } from './bill-edit-component/bill-edit-component';
import { MaterialModule } from '../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './bill-component.html',
  styleUrls: ['./bill-component.css']
})
export class BillComponent implements OnInit {
  displayedColumns: string[] = ['idBill', 'booking', 'dateEmission', 'total', 'paymentMethod', 'state', 'actions'];
  dataSource: MatTableDataSource<Bill>;
  allBills: Bill[] = [];
  filteredBills: Bill[] = [];
  
  searchTerm: string = '';
  filterState: string = 'all';
  filterPaymentMethod: string = 'all';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private billService: BillService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.billService.getBillChange().subscribe(data => {
      this.createTable(data);
    });

    this.billService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'right' });
    });

    this.loadBills();
  }

  loadBills(): void {
    console.log('Cargando facturas...');
    this.billService.findAll().subscribe({
      next: (data) => {
        console.log('Facturas cargadas:', data);
        this.allBills = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        this.snackBar.open('Error al cargar facturas', 'ERROR', { duration: 3000 });
      }
    });
  }

  createTable(data: Bill[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(): void {
    let filtered = [...this.allBills];

    // Filtro de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(bill => 
        bill.idBill?.toString().includes(term) ||
        bill.booking?.customer?.firstName?.toLowerCase().includes(term) ||
        bill.booking?.customer?.lastName?.toLowerCase().includes(term) ||
        bill.total?.toString().includes(term)
      );
    }

    // Filtro de estado
    if (this.filterState && this.filterState !== 'all') {
      filtered = filtered.filter(bill => 
        bill.state?.toLowerCase() === this.filterState.toLowerCase()
      );
    }

    // Filtro de método de pago
    if (this.filterPaymentMethod && this.filterPaymentMethod !== 'all') {
      filtered = filtered.filter(bill => 
        bill.paymentMethod?.toLowerCase() === this.filterPaymentMethod.toLowerCase()
      );
    }

    this.filteredBills = filtered;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onFilterStateChange(value: string): void {
    this.filterState = value;
    this.applyFilters();
  }

  onFilterPaymentChange(value: string): void {
    this.filterPaymentMethod = value;
    this.applyFilters();
  }

  getTotalAmount(): number {
    return this.filteredBills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  }

  getPaymentIcon(paymentMethod: string): string {
    const icons: { [key: string]: string } = {
      'efectivo': 'attach_money',
      'tarjeta': 'credit_card',
      'transferencia': 'account_balance',
      'yape': 'phone_android',
      'plin': 'phone_android'
    };
    return icons[paymentMethod?.toLowerCase()] || 'payment';
  }

  openDialog(bill?: Bill): void {
    const dialogRef = this.dialog.open(BillEditComponent, {
      width: '600px',
      data: bill,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBills();
    });
  }

  deleteBill(bill: Bill): void {
    if (confirm(`¿Está seguro de eliminar la factura #${bill.idBill}?`)) {
      this.billService.delete(bill.idBill).subscribe({
        next: () => {
          this.billService.setMessageChange('Factura eliminada correctamente');
          this.loadBills();
        },
        error: (error) => {
          console.error('Error al eliminar factura:', error);
          this.snackBar.open('Error al eliminar factura', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}
