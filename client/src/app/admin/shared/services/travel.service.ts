import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) { }

  getTravels(): Observable<any>{
    return this.http.get(environment.TRAVEL_API);
  }

  getTravel(travelId: string): Observable<any> {
    return this.http.get(environment.TRAVEL_API + '/get-travel/' + travelId);
  }
  deleteTravel(travelId: string): Observable<any>{
    return this.http.delete(environment.TRAVEL_API + `/${travelId}`);
  }
}