import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import jwt_decode from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

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

    getCabinetData(email: string): Observable<any> {
        return this.http.get(`api/cabinet/${email}`);
    }
    createCabinetData(data: any) {
        return this.http.post('api/cabinet', {
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
}
