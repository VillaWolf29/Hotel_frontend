import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenericService } from './generic-service';
import { Pay } from '../model/pay';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayService extends GenericService<Pay> {
  private payChange: Subject<Pay[]> = new Subject<Pay[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/pays`);
  }

  setPayChange(data: Pay[]) {
    this.payChange.next(data);
  }

  getPayChange() {
    return this.payChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
