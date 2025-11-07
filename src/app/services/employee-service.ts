import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Employee } from '../model/employee';
import { GenericService } from "./generic-service";
import { Subject } from "rxjs";
import { inject } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends GenericService<Employee> {
  private employeeChange: Subject<Employee[]> = new Subject<Employee[]>();
  private messageChange: Subject<string> = new Subject<string>();
  constructor() {
    super(inject(HttpClient), `${environment.HOST}/employees`);
  }
  setEmployeeChange(data: Employee[]) {
    this.employeeChange.next(data);
  }
  getEmployeeChange() {
    return this.employeeChange.asObservable();
  }
  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
