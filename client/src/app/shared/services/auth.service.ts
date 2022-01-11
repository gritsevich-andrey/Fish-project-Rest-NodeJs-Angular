import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = '';

  constructor(private http: HttpClient) {
  }

    register(user: { password: any; role: [string]; email: any }) {
    return this.http.post<User>(environment.AUTH_API + '/register', user)
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(environment.AUTH_API + '/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
          }
        )
      )
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken('');
    localStorage.clear();
  }

  restorePassword(email: any): Observable<any> {
    return this.http.post(environment.AUTH_API + '/restore-password', {email})
  }
}
