import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) {
  }

  getPhotos(): Observable<any> {
    return this.http.get('/api/photo').pipe(map((data: any) => {
      return data.map((data: any) => {
        return {
          fotoId: data._id,
          imageSrc: data.imageSrc,
          userEmail: data.userEmail,
          description: data.description,
          moderation: data.moderation,
          banDescription: data.banDescription,
          public: data.public,
          date: data.date
        }
      })
    }))
  }

  getFIO(emails: any): Observable<any> {
    return this.http.post('/api/cabinet/fio', {emails});
  }

  updateFotoInfo(photoInfo: any): Observable<any> {
    return this.http.patch(`/api/photo/${photoInfo.userEmail}`, {...photoInfo})
  }

}
