import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { RegisterComponent } from './pages/register-component/register-component';
import { HomeComponent } from './pages/home/home-component';
import { RoomsComponent } from './pages/room-component/room-component';
import { BookingDialogComponent } from './pages/booking-dialog/booking-dialog-component';
import { CustomersComponent } from './pages/customers.component';
import { EmployeesComponent } from './pages/employees.component';
import { PaymentsComponent } from './pages/pay.component';
import { BillsComponent } from './pages/bills.component';
import { ServicesComponent } from './pages/services.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (sin autenticación)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas protegidas con autenticación
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingDialogComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [authGuard] },
  { path: 'bills', component: BillsComponent, canActivate: [authGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [authGuard] },
  
  // Redireccionar rutas no encontradas al login
  { path: '**', redirectTo: 'login' }
];