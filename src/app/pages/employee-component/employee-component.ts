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
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { EmployeeEditComponent } from './employee-edit-component/employee-edit-component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-employees',
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
  templateUrl: './employee-component.html',
  styleUrls: ['./employee-component.css']
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['idEmpleado', 'firstName', 'lastName', 'post', 'phone', 'email', 'actions'];
  dataSource: MatTableDataSource<Employee>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadEmployees();

    this.employeeService.getEmployeeChange().subscribe(data => {
      this.dataSource.data = data;
    });

    this.employeeService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000 });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees() {
    this.employeeService.findAll().subscribe(data => {
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

  openDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(EmployeeEditComponent, {
      width: '600px',
      data: employee,
      disableClose: true
    });
  }

  delete(employee: Employee) {
    if (confirm(`¿Está seguro de eliminar al empleado ${employee.firstName} ${employee.lastName}?`)) {
      this.employeeService.delete(employee.idEmpleado).pipe(
        switchMap(() => this.employeeService.findAll())
      ).subscribe(data => {
        this.employeeService.setEmployeeChange(data);
        this.employeeService.setMessageChange('Empleado eliminado correctamente');
      });
    }
  }
}
