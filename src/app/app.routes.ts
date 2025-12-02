import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home-component';
import { RoomsComponent } from './pages/room-component/room-component';
import { BookingDialogComponent } from './pages/booking-dialog/booking-dialog-component';
import { CustomersComponent } from './pages/customers.component';
import { EmployeesComponent } from './pages/employees.component';
import { PaymentsComponent } from './pages/pay.component';
import { BillsComponent } from './pages/bills.component';
import { ServicesComponent } from './pages/services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'bookings', component: BookingDialogComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'services', component: ServicesComponent }
];