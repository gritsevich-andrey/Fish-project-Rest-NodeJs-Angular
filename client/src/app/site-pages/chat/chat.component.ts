import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private socket: any;
  public data: any;
  constructor() {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit(): void {
    this.socket.on('notification', (data: any) => {
      this.data = data;
      console.log('data', data)
    });
  }

}
