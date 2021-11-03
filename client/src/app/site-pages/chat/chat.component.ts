import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private socket: any;
  public data: any;
  constructor() {
    // @ts-ignore
    this.socket = io('http://127.0.0.1:5000');
  }

  ngOnInit(): void {
    this.socket.on('notification', (data: any) => {
      this.data = data;
    });
  }

}
