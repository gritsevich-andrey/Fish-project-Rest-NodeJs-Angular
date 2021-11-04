import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import {NgForm} from "@angular/forms";
import {SocketMessageDto} from "../../shared/models/SocketMessageDto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private socket: any;
  public data: any;
  chats = [];
  chatInfo: SocketMessageDto[] = [];
  constructor() {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit(): void {
    this.socket.on('newMessage', (data: any) => {
      // @ts-ignore
      this.chatInfo.push(data);
    })
  }

  sendMessage(sendForm: NgForm) {
    const socketMessageDto = new SocketMessageDto(sendForm.value.user, sendForm.value.message);
    this.socket.emit('chat', socketMessageDto);
    sendForm.controls.message.reset();
  }
}
