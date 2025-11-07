import { Bill } from "./bill";

export class Pay {
    idPay: number;
    datePay: Date;
    amount: number;
    paymentMethod: string;
    bill: Bill;
}

