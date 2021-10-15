import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getListUsers(): Observable<any> {
    return this.http.get('/api/administrator');
  }

  getComplaintById(id: string): Observable<any> {
    return this.http.get(`/api/complaint/${id}`);
  }

  banUserById(id: string) {
    return this.http.post('/api/administrator/ban', {id})
  }

  unBanUserById(id: string) {
    return this.http.post('/api/administrator/unban', {id})
  }
}
