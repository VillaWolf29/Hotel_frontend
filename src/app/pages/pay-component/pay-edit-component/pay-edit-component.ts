import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';
import { Pay } from '../../../model/pay';
import { Bill } from '../../../model/bill';
import { PayService } from '../../../services/pay-service';
import { BillService } from '../../../services/bill-service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pay-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './pay-edit-component.html',
  styleUrls: ['./pay-edit-component.css']
})
export class PayEditComponent implements OnInit {
  form: FormGroup;
  bills: Bill[] = [];
  paymentMethods: string[] = ['efectivo', 'tarjeta', 'transferencia', 'yape', 'plin'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pay,
    private dialogRef: MatDialogRef<PayEditComponent>,
    private payService: PayService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.loadBills();
    
    this.form = new FormGroup({
      idPay: new FormControl(this.data?.idPay),
      datePay: new FormControl(this.data?.datePay || new Date(), Validators.required),
      amount: new FormControl(this.data?.amount, [Validators.required, Validators.min(0)]),
      paymentMethod: new FormControl(this.data?.paymentMethod, Validators.required),
      bill: new FormControl(this.data?.bill, Validators.required)
    });
  }

  loadBills(): void {
    this.billService.findAll().subscribe({
      next: (data) => {
        this.bills = data;
        console.log('Facturas cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
      }
    });
  }

  operate(): void {
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.value);
      console.log('Errores:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    const pay: Pay = {
      ...this.form.value,
      bill: this.bills.find(b => b.idBill === this.form.value.bill?.idBill || b.idBill === this.form.value.bill)
    };

    console.log('Pago a guardar:', pay);

    if (this.data?.idPay) {
      // Update
      this.payService.update(pay.idPay, pay).subscribe({
        next: () => {
          this.payService.setMessageChange('Pago actualizado correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al actualizar pago:', error);
          this.payService.setMessageChange('Error al actualizar pago');
        }
      });
    } else {
      // Create
      this.payService.save(pay).subscribe({
        next: () => {
          this.payService.setMessageChange('Pago creado correctamente');
          this.close();
        },
        error: (error) => {
          console.error('Error al crear pago:', error);
          this.payService.setMessageChange('Error al crear pago');
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  compareBills(b1: Bill, b2: Bill): boolean {
    return b1 && b2 ? b1.idBill === b2.idBill : b1 === b2;
  }
}
