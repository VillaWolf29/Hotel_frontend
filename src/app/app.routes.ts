import { Routes } from '@angular/router';
import { RoomsComponent } from './pages/rooms.component';
import { BookingsComponent } from './pages/bookings.component';
import { CustomersComponent } from './pages/customers.component';
import { EmployeesComponent } from './pages/employees.component';
import { PaymentsComponent } from './pages/pay.component';
import { BillsComponent } from './pages/bills.component';
import { ServicesComponent } from './pages/services.component';

export const routes: Routes = [
  { path: '', component: RoomsComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'services', component: ServicesComponent }
];