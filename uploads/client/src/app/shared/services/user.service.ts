import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import jwt_decode from "jwt-decode";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) {
  }

  getListUsers(): Observable<any> {
    return this.http.get(environment.ADMIN_API);
  }

  getComplaintByEmail(email: string): Observable<any> {
    return this.http.get(environment.COMPLAINT_API +`/${email}`);
  }

  deleteComplaintById(email: string, id: string): Observable<any> {
    return this.http.delete(environment.COMPLAINT_API +`/${email}/${id}`)
  }

  banUserByEmail(email: string): Observable<any> {
    return this.http.patch(environment.ADMIN_API +'/ban', {email})
  }

  unBanUserByEmail(email: string): Observable<any> {
    return this.http.patch(environment.ADMIN_API+'/unban', {email})
  }

  getCabinetData(email: string): Observable<any> {
    return this.http.get(environment.CABINET_API+ `/${email}`);
  }

  createCabinetData(data: any) {
    return this.http.post(environment.CABINET_API, {
      email: data.email,
      fio: data.fio,
      age: data.age,
      gender: data.gender,
      technique: data.technique,
      juridicalPerson: data.juridicalPerson,
      avatar: data.avatar
    });
  }

  getUserDataFromLocal(): string {
    const token = localStorage.getItem('auth-token');
    // @ts-ignore
    const tokenSplit = token.split(' ');
    // @ts-ignore
    const {email} = jwt_decode(tokenSplit[1]);
    return email;
  }

  getUserRole(): string {
    const decoded = this.decodeToken();
    const userRoles = decoded.role;
    return userRoles;
  }

  decodeToken(): any {
    const token = localStorage.getItem('auth-token');
    // @ts-ignore
    const tokenSplit = token.split(' ');
    const decoded = jwt_decode(tokenSplit[1]);
    return decoded;
  }

}
