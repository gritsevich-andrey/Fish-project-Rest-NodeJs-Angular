import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {distinctUntilChanged, map, shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) {
  }

  getUserTravels(userEmail: string): Observable<any> {
    return this.http.get(environment.TRAVEL_API + '/' + userEmail)
      .pipe(
        shareReplay()
      )
  }

  private generateFormData(data: any) {
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
    return formData
  }

  createTravel(data: any): Observable<any> {
    const formData = this.generateFormData(data)
    return this.http.post(environment.TRAVEL_API, formData)
  }

  updateTravel(data: any, travelId: string): Observable<any> {
    const formData = this.generateFormData(data)
    return this.http.patch(environment.TRAVEL_API + '/update/' + travelId, formData)
  }

  getAllTravels(): Observable<any> {
    return this.http.get(environment.TRAVEL_API)
      .pipe(
        distinctUntilChanged(),
        shareReplay()
      )
  }

  updateUserStatus(travelId: string, userEmail: string, status: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/change-user-status', {travelId, userEmail, status})
  }

  updateUserRating(travelId: string, userEmail: string, rating: number): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/update-user-rating', {travelId, userEmail, rating})
  }

  updateUserTravelRating(travelId: string, userEmail: string, travelRating: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/update-user-travelRating', {travelId, userEmail, travelRating})
  }

  updateUserRejectComment(travelId: string, userEmail: string, comment: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/update-user-comment', {travelId, userEmail, comment})
  }

  updateTravelStatus(travelId: string, status: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/change-travel-status', {travelId, status})
  }

  joinTravel(userEmail: string, travelId: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/join', {travelId, userEmail})
  }

  leaveFromTravel(userEmail: string, travelId: string): Observable<any> {
    return this.http.patch(environment.TRAVEL_API + '/leave', {travelId, userEmail})
  }

  updateUserReview(travelId: string, userEmail: string) {
    return this.http.patch(environment.TRAVEL_API + '/update-user-review', {travelId, userEmail})
  }

  updateUserTravelReview(travelId: string, userEmail: string) {
    return this.http.patch(environment.TRAVEL_API + '/update-user-travelReview', {travelId, userEmail})
  }
}

