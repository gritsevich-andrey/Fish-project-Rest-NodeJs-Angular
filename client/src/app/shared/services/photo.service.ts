import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) {
  }

  getPhotos(): Observable<any> {
    return this.http.get(environment.PHOTO_API).pipe(map((data: any) =>
      data.map((data: any) => {
        return {
          fotoId: data._id,
          imageSrc: data.imageSrc,
          userEmail: data.userEmail,
          description: data.description,
          moderation: data.moderation,
          banDescription: data.banDescription,
          public: data.public,
          date: data.date,
          //likeCount: data.likesCount
        }
      })
    ))
  }

  getFeedPhotos(pageSize?: number, page?: number): Observable<any> {
    let url = environment.PHOTO_API
    if (pageSize && page) url = `${environment.PHOTO_API}?pagesize=${pageSize}&page=${page}`
    return this.http.get(url).pipe(
      map((data: any) => data.filter((el: any) => el.public && el.moderation))
    )
  }

  createPhoto(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('image', data.file, data.file.name)
    formData.append('email', data.email)
    formData.append('description', data.description)
    formData.append('public', data.public)
    formData.append('longitude', data.longitude)
    formData.append('latitude', data.latitude)
    formData.append('address', data.address)
    return this.http.post(environment.PHOTO_API, formData)
  }

  getFIO(emails: any): Observable<any> {
    return this.http.post(`${environment.CABINET_API}/fio`, {emails});
  }

  updatePhotoInfo(photoInfo: any): Observable<any> {
    return this.http.patch(environment.PHOTO_API + "/" + photoInfo.userEmail, {...photoInfo})
  }

  getComments(imageId: string): Observable<any> {
    return this.http.get(environment.COMMENTS_API + '/' + imageId)
  }

  setComment(photoId: string, commentValue: string, userEmail: string): Observable<any> {
    return this.http.post(environment.COMMENTS_API, {photoId, commentValue, userEmail})
  }

  updateLikes(imageId: string) {
    return this.http.patch(environment.PHOTO_API + "/updateLikes", {imageId}).subscribe()
  }
}


