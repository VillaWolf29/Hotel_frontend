import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { RegisterComponent } from './pages/register-component/register-component';
import { HomeComponent } from './pages/home/home-component';
import { RoomsComponent } from './pages/room-component/room-component';
import { BookingComponent } from './pages/booking-component/booking-component';
import { CustomersComponent } from './pages/customer-component/customer-component';
import { EmployeesComponent } from './pages/employee-component/employee-component';
import { PayComponent } from './pages/pay-component/pay-component';
import { BillComponent } from './pages/bill-component/bill-component';
import { ServicesComponent } from './pages/service-component/service-component';
import { ConsumptionComponent } from './pages/consumption-component/consumption-component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (sin autenticación)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas protegidas con autenticación
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'payments', component: PayComponent, canActivate: [authGuard] },
  { path: 'bills', component: BillComponent, canActivate: [authGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [authGuard] },
  { path: 'consumptions', component: ConsumptionComponent, canActivate: [authGuard] },
  
  // Redireccionar rutas no encontradas al login
  { path: '**', redirectTo: 'login' }
];