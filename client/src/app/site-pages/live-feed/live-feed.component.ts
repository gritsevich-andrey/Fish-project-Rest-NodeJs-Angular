import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../../shared/services/websocket.service";
import {ChatMessageDto} from "../../shared/models/chatMessageDto";
import {NgForm} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit, OnDestroy {
userEmail!: string;
  constructor(public webSocketService: WebsocketService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.userEmail= this.userService.getUserDataFromLocal();
    console.log(this.userEmail);
  }
  sendMessage(sendForm: NgForm) {
    const chatMessageDto = new ChatMessageDto(sendForm.value.user, sendForm.value.message);
    this.webSocketService.sendMessage(chatMessageDto);
    sendForm.controls.message.reset();
  }
  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }
}
