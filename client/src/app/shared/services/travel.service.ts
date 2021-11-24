import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) {
  }

  getUserTravels(userEmail: string): Observable<any> {
    return this.http.get(environment.TRAVEL_API + '/' + userEmail)
  }

  // updateTravel(travelId: string, data: any): Observable<any> {
  //   return this.http.patch(environment.TRAVEL_API + '/' + travelId, {...data})
  // }

  createTravel(data: any): Observable<any> {
    const formData = new FormData();
    if (data.file) formData.append('image', data.file, data.file.name)
    for (let item in data) {
      if (item === 'file') continue
      if (item === 'startPoint' || item === 'endPoint') {
        formData.append(item, JSON.stringify(data[item]))
      } else {
        formData.append(item, data[item])
      }
    }
    return this.http.post(environment.TRAVEL_API, formData)
  }

  updateTravel(data: any, travelId: string): Observable<any> {
    const formData = new FormData();
    if (data.file) formData.append('image', data.file, data.file.name)
    for (let item in data) {
      if (item === 'file') continue
      if (item === 'startPoint' || item === 'endPoint') {
        formData.append(item, JSON.stringify(data[item]))
      } else {
        formData.append(item, data[item])
      }
    }
    return this.http.patch(environment.TRAVEL_API + '/' + travelId, formData)
  }

  getAllTravels(): Observable<any> {
    return this.http.get(environment.TRAVEL_API)
  }
}
