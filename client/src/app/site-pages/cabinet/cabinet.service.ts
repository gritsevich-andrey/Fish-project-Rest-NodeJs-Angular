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

  createCabinetData(data: any, image?: File): Observable<any> {
    const fd = new FormData();
    if(image) {
      fd.append('image', image, image.name);
    }
    const cabinet = {
      email: data.email,
      fio: data.fio,
      age: data.age,
      gender: data.gender,
      technique: [data.technique.name, data.technique.license],
      juridicalPerson: data.juridicalPerson,
      avatar: data.avatar
    };
    for (let cabinetKey in cabinet) {
      //Переработать массив с техникой
      // @ts-ignore
      fd.append(`${cabinetKey}`, `${cabinet[cabinetKey]}`);
    }
    return this.http.post('api/cabinet', fd);
  }
}
