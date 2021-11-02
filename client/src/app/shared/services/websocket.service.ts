import { Injectable } from '@angular/core';
import {ChatMessageDto} from "../models/chatMessageDto";
import {environment} from "../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  webSocket!: WebSocket;
  chatMessages: ChatMessageDto[] = [];
  constructor() { }
  public openWebSocket(){
    this.webSocket = new WebSocket('ws://'+ environment.BACK_URL + '/chat');

    this.webSocket.onopen = (event) => {
      console.log('Открытие вебсокета: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Закрытие вебсокета: ', event);
    };
  }

  public sendMessage(chatMessageDto: ChatMessageDto){
    this.webSocket.send(JSON.stringify(chatMessageDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
