import { Component } from '@angular/core';

@Component({
  selector: 'app-employees',
  standalone: true,
  template: `
    <div class="page-container">
      <h2>👤 Empleados</h2>
      <p>Falta continuar con el desarrollo para las interacciones</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
  `]
})
export class EmployeesComponent {}
