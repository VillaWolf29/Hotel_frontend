import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../model/booking'
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends GenericService<Booking> {
  private bookingChange: Subject<Booking[]> = new Subject<Booking[]>();
  private messageChange: Subject<string> = new Subject<string>();   
    constructor(){
    super(inject(HttpClient), `${environment.HOST}/bookings`);
 }

 setBookingChange(data: Booking[]){
    this.bookingChange.next(data);
  }

  getBookingChange(){
    return this.bookingChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}