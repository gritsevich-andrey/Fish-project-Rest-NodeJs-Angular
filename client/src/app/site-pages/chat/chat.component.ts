import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SocketMessageDto} from "../../shared/interfaces";
import {ChatService} from "./chat.service";
import {SocketService} from "./socket.service";
import {WarningService} from "../../shared/services/warning.service";
import {UserService} from "../../shared/services/user.service";
import {distinctUntilChanged, filter, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  // @ts-ignore
  chatInfoDto: SocketMessageDto;
  userEmail: string;
  // @ts-ignore
  receiverEmail = '';
  // @ts-ignore
  role: string;
  arrEmail = [];


  constructor(private chatService: ChatService,
              private socketService: SocketService,
              private warningService: WarningService,
              private userService: UserService) {
    this.userEmail = this.userService.getUserDataFromLocal();
  }


  ngOnInit(): void {
    this.socketService.openSocket();
    this.chatService.getDriverSubscriber()
      .subscribe(data => {
        if (data) {
          if(this.socketService.chatInfo.length > 0)
          {this.socketService.chatInfo.length = 0}
          this.socketService.chatInfo.push(data);
           data.passenger.forEach((value: any) => {
            this.createConnection(value.email);
          })
        }
      });
    this.userEmail = this.userService.getUserDataFromLocal();
    // this.getInfoWithChatDto();
  }

  sendMessage(sendForm: NgForm) {
    this.chatInfoDto = {
      userEmail: this.userEmail,
      receiverEmail: this.receiverEmail,
      passenger: [{
        email: this.userEmail,
        message: sendForm.value.message,
        receiverEl: this.receiverEmail,
        // @ts-ignore
        date: Date.now()
      }]
    }
    if (this.receiverEmail) {
      this.socketService.sendMessage(this.chatInfoDto);
    } else {
      this.warningService.sendWarning('Вы не выбрали получателя');
    }
    this.saveInDb();
    sendForm.controls.message.reset();
  }

  getInfoWithChatDto(): { email: string; message: string; date: Date }[] {
    const infoUsers: { email: string, message: string, date: Date }[] = [];
    this.socketService.chatInfo.map(data => {
      if (data) {
        // @ts-ignore
        data.passenger.forEach(value => {
          if (value.email) {
            if (value.email === this.userEmail) {
              value.email = `Ваше сообщение ${value.receiverEl}`
            }
            infoUsers.push(value);
          }
        })
      }
    });
    const uniqueInfo = [...new Set(infoUsers)];
    return uniqueInfo.reverse();
  }

  getUniqueReceiver() {
    const uniqueEmail: string[] = [];
    this.socketService.chatInfo.map(data => {
      if (data) {
        // @ts-ignore
        data.passenger.forEach(value => {
          if ((value.email !== this.userEmail) && !(value.email.includes('Ваше сообщение'))) {
            uniqueEmail.push(value.email);
          }
        })
      }
    });
    return [...new Set(uniqueEmail)];
  }

  addReceiverEmail(receiverEmail: string) {
    if (!(receiverEmail.includes('Ваше сообщение'))) {
      this.receiverEmail = receiverEmail;
    } else {
      this.warningService.sendWarning('Вы не можете писать себе');
    }
  }

  createConnection(receiverEmail: string) {
    if (this.userEmail !== receiverEmail) {
      // @ts-ignore
      this.arrEmail.push(receiverEmail);
    }
    const connEmail = [...new Set(this.arrEmail)];

    for (let i = 0; i < connEmail.length; i++) {
      const connectData: SocketMessageDto = {
        passenger: [
          {
            // @ts-ignore
            date: Date.now(), email: "", message: ``
          }],
        userEmail: "",
        receiverEmail: ""
      };

      connectData.userEmail = this.userEmail;
      connectData.receiverEmail = receiverEmail;

      // @ts-ignore
      this.socketService.sendMessage(connectData);
    }
  }

  saveInDb() {
    this.chatService.saveMessage(this.chatInfoDto)
      .pipe(
        mergeMap(() => {
          // @ts-ignore
          this.chatInfoDto['userEmail'] = this.chatInfoDto['receiverEmail']
         return this.chatService.saveMessage(this.chatInfoDto)
        }))
  .subscribe(()=> this.warningService.sendWarning(`Сообщение отправлено ${this.splitEmail(this.receiverEmail)}`));
  }

  splitEmail(email: string) {
    const splitEmail = email.split('@');
    return splitEmail[0];
  }
}
