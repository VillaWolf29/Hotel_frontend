import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Customer } from '../model/customer';
import { GenericService } from './generic-service';
import { Subject } from "rxjs";
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends GenericService<Customer> {
  private customerChange: Subject<Customer[]> = new Subject<Customer[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(){
    super(inject(HttpClient), `${environment.HOST}/customers`);
  }

  setCustomerChange(data: Customer[]){
    this.customerChange.next(data);
  }

  getCustomerChange(){
    return this.customerChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}




