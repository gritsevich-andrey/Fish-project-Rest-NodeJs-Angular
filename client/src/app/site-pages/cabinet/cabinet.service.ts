import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {User} from "../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  constructor(private http: HttpClient) {
  }

  getCabinetData(email: string): Observable<User> {
    return this.http.get<User>(environment.CABINET_API + `/${email}`);
  }
  getAllCabinets(): Observable<User> {
    return this.http.get<User>(environment.CABINET_API);
  }

  getCabinetRating(travelId: string, email: string): Observable<any> {
    return this.http.get<any>(environment.CABINET_API + `/rating/${travelId}/${email}`);
  }

  createCabinetData(data: any, image?: File): Observable<any> {
    const fd = this.createFormData(data, image);
    return this.http.post(environment.CABINET_API, fd);
  }

  updateCabinetData(data: any, image?: File): Observable<any> {
    const fd = this.createFormData(data, image);
    return this.http.patch(environment.CABINET_API, fd);
  }

  updateCabinetReview(email: string, review: { userEmail: string; reviewText: string; travelId: string, userFIO: string, travelName: string }): Observable<any> {
    return this.http.patch(environment.CABINET_API + `/update/${email}`, {
      userEmail: review.userEmail,
      reviewText: review.reviewText,
      travelId: review.travelId,
      userFIO: review.userFIO
    });
  }

  updateCabinetRating(email: string, rating: any): Observable<any> {
    return this.http.patch(environment.CABINET_API + `/rating/${email}`, rating);
  }

  createFormData(data: any, image?: File) {
    const fd = new FormData();
    if (image) {
      fd.append('image', image, image.name);
    }
    const cabinet = {
      email: data.email,
      fio: data.fio,
      age: data.age,
      gender: data.gender,
      technique: data.technique,
      juridicalPerson: data.juridicalPerson,
      avatar: data.avatar,
      inn: data.inn,
      kpp: data.kpp,
      organizationName: data.organizationName
    };
    for (let cabinetKey in cabinet) {
      // @ts-ignore
      if (cabinetKey !== 'technique') {
        // @ts-ignore
        fd.append(`${cabinetKey}`, `${cabinet[cabinetKey]}`);
      } else {
        fd.append('technique', JSON.stringify(cabinet.technique));
      }
    }
    return fd;
  }

  getPhotoByUserEmail(email: string, photosPerPage: number, currentPage: number): Observable<any> {
    const queryParams = `?pagesize=${photosPerPage}&page=${currentPage}`
    return this.http.get<{ message: string, photos: any, maxPhotos: number }>(environment.PHOTO_API + '/' + email + queryParams);
  }

  getTransportByEmail(userEmail: string) {
    return this.http.get(environment.CABINET_API + '/' + userEmail).pipe(map((data: any) => JSON.parse(data.technique)))
  }

  getReviewsCabinetData(): Observable<any> {
    return this.http.get(environment.CABINET_API + '/get-cabinets-with-reviews')
  }

  getUserReviews(userEmail: string): Observable<any> {
    return this.http.get(environment.CABINET_API + '/get-user-reviews/' + userEmail)
  }

  updateReviewShown(reviewId: string, status: boolean, rejectionReason?: string): Observable<any> {
    return this.http.patch(environment.CABINET_API + '/update-review-shown', {
      id: reviewId,
      status,
      rejectionReason
    })
  }
}
