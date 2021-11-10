import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SocketMessageDto} from "../../shared/interfaces";
import {ChatService} from "./chat.service";
import {SocketService} from "./socket.service";
import {WarningService} from "../../shared/services/warning.service";
import {UserService} from "../../shared/services/user.service";
import jwt_decode from "jwt-decode";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  // public data: any;
  // @ts-ignore
  chatInfoDto: SocketMessageDto;
  userEmail: string;
  // @ts-ignore
  receiverEmail: string;
  // @ts-ignore
  role: string;
  // @ts-ignore
  private chatSub: Subscription;

  constructor(private chatService: ChatService,
              private socketService: SocketService,
              private warningService: WarningService,
              private userService: UserService) {
    this.userEmail = this.getUserEmail();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.saveInDb();
    if (this.chatSub){
      this.chatSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.socketService.openSocket();
  this.chatSub =  this.chatService.getDriverSubscriber()
      .subscribe(data => {
        this.socketService.chatInfo.push(data);
      });
    const role = this.userService.getUserRole();

    if (role[0] === 'DRIVER') {
      this.role = role[0];
    }
    this.userEmail = this.chatService.getUserEmail();
    this.getInfoWithChatDto();
    this.createConnection();
  }

  sendMessage(sendForm: NgForm) {
    this.chatInfoDto = {
      userEmail: this.receiverEmail,
      receiverEmail: this.userEmail,
      passenger: [{
        email: this.userEmail,
        message: sendForm.value.message,
        // @ts-ignore
        date: Date.now()
      }]
    }
    if (this.role === 'DRIVER') {
      // @ts-ignore
      this.chatInfoDto['userEmail'] = this.userEmail;
      this.chatInfoDto['receiverEmail'] = this.receiverEmail;
    }
    if (this.receiverEmail) {
      this.socketService.sendMessage(this.chatInfoDto);
    } else {
      this.warningService.sendWarning('Вы не выбрали получателя');
    }
    this.saveInDb();
    sendForm.controls.message.reset();
  }

  getInfoWithChatDto() {
    const infoUsers: { email: string, message: string, date: Date }[] = [];
    this.socketService.chatInfo.map(data => {
      data.passenger.forEach(value => {
        infoUsers.push(value);
      })
    });
    const sortedArray = infoUsers.sort((item1: any, item2: any) => {
      return item1.date - item2.date;
    });
    return sortedArray;
  }

  getUniqueReceiver() {
    const uniqueEmail: string[] = [];
    this.socketService.chatInfo.map(data => {
      // @ts-ignore
      data.passenger.forEach(value => {
        if (value.email !== this.userEmail) {
          uniqueEmail.push(value.email);
        }
      })
    });
    return [...new Set(uniqueEmail)];
  }

  addReceiverEmail(receiverEmail: string) {
    this.receiverEmail = receiverEmail;
    // this.createConnection(receiverEmail);
  }

  getUserEmail(): string {
    const token = localStorage.getItem('auth-token');
    // @ts-ignore
    const tokenSplit = token.split(' ');
    // @ts-ignore
    const {email} = jwt_decode(tokenSplit[1]);
    return email;
  }

  createConnection() {
    const connectData = {userEmail: "", receiverEmail: ''};
        if (this.role === 'DRIVER') {
          connectData.userEmail = this.userEmail;
          connectData.receiverEmail = this.receiverEmail;
        }
        else {
          connectData.userEmail = this.receiverEmail;
          connectData.receiverEmail = this.userEmail;
    }

    // @ts-ignore
    // this.socketService.sendMessage(connectData);
  }
saveInDb(){
  this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
    console.log(data);
  });
  // @ts-ignore
  this.chatInfoDto['userEmail'] = this.chatInfoDto['receiverEmail'];
  this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
    console.log(data);
  })
}
}
