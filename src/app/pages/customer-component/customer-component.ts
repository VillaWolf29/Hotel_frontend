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
import { Customer } from '../../model/customer';
import { CustomerService } from '../../services/customer-service';
import { CustomerEditComponent } from './customer-edit-component/customer-edit-component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-customers',
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
  templateUrl: './customer-component.html',
  styleUrls: ['./customer-component.css']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['idCustomer', 'firstName', 'lastName', 'email', 'phone', 'idCard', 'address', 'actions'];
  dataSource: MatTableDataSource<Customer>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadCustomers();

    this.customerService.getCustomerChange().subscribe(data => {
      this.dataSource.data = data;
    });

    this.customerService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000 });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCustomers() {
    this.customerService.findAll().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(customer?: Customer) {
    const dialogRef = this.dialog.open(CustomerEditComponent, {
      width: '600px',
      data: customer,
      disableClose: true
    });
  }

  delete(customer: Customer) {
    if (confirm(`¿Está seguro de eliminar al cliente ${customer.firstName} ${customer.lastName}?`)) {
      this.customerService.delete(customer.idCustomer).pipe(
        switchMap(() => this.customerService.findAll())
      ).subscribe(data => {
        this.customerService.setCustomerChange(data);
        this.customerService.setMessageChange('Cliente eliminado correctamente');
      });
    }
  }
}
