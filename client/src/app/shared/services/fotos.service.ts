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
          imageSrc: data.imageSrc,
          userEmail: data.userEmail,
          description: data.description,
          moderation: data.moderation,
          banDescription: data.banDescription,
          date: data.date
        }
      })
    }))
  }

  getFIO(emails: any) {
    return this.http.post('/api/cabinet/fio', {emails});
  }

}
