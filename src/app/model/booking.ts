import { Customer } from "./customer";
import { Room } from "./room";
import { Employee } from "./employee";

export class Booking {
    idBooking: number;
    dateBooking: Date;
    dateCheckIn: Date;
    dateCheckOut: Date;
    state: string;
    customer: Customer;
    room: Room;
    employee: Employee;
}