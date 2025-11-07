import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Bill } from '../model/bill';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillService extends GenericService<Bill> {
  private billChange: Subject<Bill[]> = new Subject<Bill[]>();
  private messageChange: Subject<string> = new Subject<string>();

 constructor(){
    super(inject(HttpClient), `${environment.HOST}/bills`);
 }

 setBillChange(data: Bill[]){
    this.billChange.next(data);
  }

  getBillChange(){
    return this.billChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

    getMessageChange(){
    return this.messageChange.asObservable();
  }

}

