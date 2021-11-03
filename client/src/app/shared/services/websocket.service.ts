import {Injectable} from '@angular/core';
import {ChatMessageDto} from "../models/chatMessageDto";
import {environment} from "../../../environments/environment.prod";
import {PhotoService} from "./fotos.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  webSocket!: WebSocket;
  chatMessages: ChatMessageDto[] = [];

  constructor(private photoService: PhotoService) {
  }

  public openWebSocket() {
    this.webSocket = new WebSocket('ws://' + environment.BACK_URL + '/chat');

    this.webSocket.onopen = (event) => {
      console.log('Открытие вебсокета: ', event);
      this.photoService.getPhotos().pipe(map(data => {
        return data.map((data: any) => {
          return {
            file: data.imageSrc,
            user: data.userEmail,
            description: data.description,
            isMine: false
          }
        })
      })).subscribe(
        data => {
          this.chatMessages = [...data]
        },
        error => {
          console.log(error)
        }
      )
    };

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);
      this.chatMessages.push(chatMessageDto);
      debugger
    };

    this.webSocket.onclose = (event) => {
      console.log('Закрытие вебсокета: ', event);
      console.log(this.chatMessages)
    };
  }

  public sendMessage(chatMessageDto: ChatMessageDto) {
    this.webSocket.send(JSON.stringify(chatMessageDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
