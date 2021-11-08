import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {SocketMessageDto} from "../../shared/interfaces";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  chatInfo: SocketMessageDto[] = [];

  constructor() {
    this.socket = io('http://localhost:3001');
  }
  openSocket() {
    this.socket.on('newMessage', (data: any) => {
      // @ts-ignore
      this.chatInfo.push(data);
    });
  }
  sendMessage(chatInfoDto: SocketMessageDto) {
    this.socket.emit('chat', chatInfoDto);
  }
}
