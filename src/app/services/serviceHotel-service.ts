import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenericService } from './generic-service';
import { ServiceHotel } from '../model/serviceHotel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceHotelService extends GenericService<ServiceHotel> {
  private serviceHotelChange: Subject<ServiceHotel[]> = new Subject<ServiceHotel[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/servicehotels`);
  }

  setServiceHotelChange(data: ServiceHotel[]) {
    this.serviceHotelChange.next(data);
  }

  getServiceHotelChange() {
    return this.serviceHotelChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
