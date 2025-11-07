import { Booking } from "./booking";
import { ServiceHotel } from "./serviceHotel";

export class Consumption {
    idConsumption: number;
    amount: number;
    dateConsumption: Date;
    subtotal: number;
    booking: Booking;
    serviceHotel: ServiceHotel;  
}