import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Consumption } from '../model/consumption';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService extends GenericService<Consumption> {
  private consumptionChange: Subject<Consumption[]> = new Subject<Consumption[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(){
    super(inject(HttpClient), `${environment.HOST}/consumptions`);
  }

  setConsumptionChange(data: Consumption[]){
    this.consumptionChange.next(data);
  }

  getConsumptionChange(){
    return this.consumptionChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}