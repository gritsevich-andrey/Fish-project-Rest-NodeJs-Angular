import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) { }

  getUserTravels(userEmail: string): Observable<any> {
    return this.http.get(environment.TRAVEL_API + '/' + userEmail)
  }

  updateTravel(travelId: string, data: any): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/' + travelId, {...data})
  }

  createTravel(data: any): Observable<any> {
    return this.http.post(environment.TRAVEL_API, {...data})
  }
}
