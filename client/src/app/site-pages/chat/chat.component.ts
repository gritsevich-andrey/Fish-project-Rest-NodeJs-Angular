import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SocketMessageDto} from "../../shared/interfaces";
import {ChatService} from "./chat.service";
import {SocketService} from "./socket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public data: any;
  chatInfoDto?: SocketMessageDto;
  driverEmail?: string;

  constructor(private chatService: ChatService,
              private socketService: SocketService) {
    this.driverEmail = chatService.getDriverEmail();
  }

  ngOnInit(): void {
   this.socketService.openSocket();
    this.chatService.getDriverSubscriber()
      .subscribe(data => {
        this.socketService.chatInfo.push(data);
      });
    this.getInfoWithChatDto();
  }

  sendMessage(sendForm: NgForm) {
    const email = this.chatService.getDriverEmail();
    // @ts-ignore
    this.chatInfoDto = {
      driverEmail: email,
      passenger: [{
        email: email,
        message: sendForm.value.message,
        // @ts-ignore
        date: Date.now()
      }]
    }
    this.socketService.sendMessage(this.chatInfoDto)
    // this.chatService.saveMessage(this.chatInfoDto)
    //   .subscribe(data => console.log(data));
    sendForm.controls.message.reset();
  }

  getInfoWithChatDto() {
    const infoUsers: { email: string; message: string; date: Date; }[] = [];
    this.socketService.chatInfo.map(data => {
      data.passenger.forEach(value => {
        infoUsers.push(value);
      })
    });
    return infoUsers;
  }
}
