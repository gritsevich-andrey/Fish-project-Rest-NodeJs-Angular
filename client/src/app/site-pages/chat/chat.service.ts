import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {SocketMessageDto} from "../../shared/interfaces";
import {Observable} from "rxjs";
import {UserService} from "../../shared/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
    private userService: UserService) {
  }

  saveMessage(chatInfoDto?: SocketMessageDto): Observable<SocketMessageDto> {
    return this.http.post<SocketMessageDto>(environment.CHAT_API, chatInfoDto);
  }

  getDriverSubscriber(): Observable<any> {
    const email = this.userService.getUserDataFromLocal();
    return this.http.get(environment.CHAT_API + `/${email}`);
  }

  getUserEmail(): string {
    const email = this.userService.getUserDataFromLocal();
    return email;
  }

}
