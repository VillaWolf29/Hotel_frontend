import { Booking } from "./booking";

export class Bill {
    idBill: number;
    dateEmission: Date;
    total: number;
    paymentMethod: string;
    state: string;
    booking: Booking;
}