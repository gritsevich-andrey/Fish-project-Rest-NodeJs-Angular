import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  constructor(private http: HttpClient) { }
  getCabinetData(email: string): Observable<any> {
    return this.http.get(environment.CABINET_API+`/${email}`);
  }

  createCabinetData(data: any, image?: File): Observable<any> {
   const fd = this.createFormData(data, image);
    return this.http.post(environment.CABINET_API, fd);
  }

  updateCabinetData(data: any, image?: File): Observable<any> {
   const fd = this.createFormData(data, image);
    return this.http.patch(environment.CABINET_API, fd);
  }

  createFormData(data: any, image?: File) {
    const fd = new FormData();
    if(image) {
      fd.append('image', image, image.name);
    }
    const cabinet = {
      email: data.email,
      fio: data.fio,
      age: data.age,
      gender: data.gender,
      technique: data.technique,
      juridicalPerson: data.juridicalPerson,
      avatar: data.avatar
    };
    for (let cabinetKey in cabinet) {
      // @ts-ignore
      if (cabinetKey !== 'technique'){
        // @ts-ignore
        console.log(cabinetKey, cabinet[cabinetKey])
        // @ts-ignore
        fd.append(`${cabinetKey}`, `${cabinet[cabinetKey]}`);
      }
      else {
        fd.append('technique', JSON.stringify(cabinet.technique));
      }
    }
    return fd;
  }
  getPhotoByUserEmail(photosPerPage: number, currentPage: number): Observable<any> {
    const queryParams = `?pagesize=${photosPerPage}&page=${currentPage}`
    return this.http.get<{message: string, photos: any, maxPhotos: number}>(environment.PHOTO_API + queryParams);
  }
}
