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

  getComplaintByEmail(email: string): Observable<any> {
    return this.http.get(`/api/complaint/${email}`);
  }

  createComplaintByEmail(email: string, description: string): Observable<any> {
    return this.http.post(`/api/complaint/`, {email, description});
  }

  banUserByEmail(email: string) {
    return this.http.post('/api/administrator/ban', {email})
  }

  unBanUserByEmail(email: string) {
    return this.http.post('/api/administrator/unban', {email})
  }
}
