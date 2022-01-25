import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {filter, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {PhotoAdmin} from "../interfaces";

@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    constructor(private http: HttpClient) {
    }

    getPhotos(): Observable<any> {
        return this.http.get(environment.PHOTO_API)
    }

    getFeedPhotos(pageSize?: number, page?: number): Observable<any> {
        let url = environment.PHOTO_API
        if (pageSize && page)
            url = `${environment.PHOTO_API}?pagesize=${pageSize}&page=${page}`
        return this.http.get(url).pipe(map((photos: any) => photos.filter((photo: PhotoAdmin) => photo.public && photo.moderation && !photo.queryDeleted)))
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

    setComment(imageId: string, value: string, email: string): Observable<any> {
        return this.http.patch(environment.PHOTO_API + '/set-comment', {imageId, value, email})
    }

    incrementLikes(imageId: string): Observable<any> {
        return this.http.patch(environment.PHOTO_API + "/increment-likes", {imageId})
    }

    decrementLikes(imageId: string): Observable<any> {
        return this.http.patch(environment.PHOTO_API + "/decrement-likes", {imageId})
    }

    deletePhoto(imageId: string): Observable<any> {
        return this.http.delete(environment.PHOTO_API + '/' + imageId)
    }
  updatePhotoPublic(photoInfo: any): Observable<any> {
    return this.http.patch(environment.PHOTO_API + "/", {...photoInfo})
  }
}


