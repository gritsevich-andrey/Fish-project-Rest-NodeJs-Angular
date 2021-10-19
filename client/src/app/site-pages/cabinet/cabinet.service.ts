import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CabinetService {

  constructor(private http: HttpClient) { }
  getCabinetData(email: string): Observable<any> {
    return this.http.get(`api/cabinet/${email}`);
  }

  createCabinetData(data: any): Observable<any> {
    return this.http.post('api/cabinet', {
      email: data.email,
      fio: data.fio,
      age: data.age,
      gender: data.gender,
      technique: data.technique,
      juridicalPerson: data.juridicalPerson,
      avatar: data.avatar
    });
  }
}
