import {Component, OnDestroy, OnInit} from '@angular/core';
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
  // @ts-ignore
  chatInfoDto: SocketMessageDto;
  userEmail: string;
  // @ts-ignore
  receiverEmail = '';
  // @ts-ignore
  role: string;
  private chatSub?: Subscription;
  private messSub?: Subscription;
  imagesOnPage = 2;
  imagesPage = 1;
  showSpinner = false
  arrEmail = [];

  constructor(private chatService: ChatService,
              private socketService: SocketService,
              private warningService: WarningService,
              private userService: UserService) {
    this.userEmail = this.getUserEmail();
  }

  ngOnDestroy(): void {
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
    if (this.messSub) {
      this.messSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.socketService.openSocket();
    this.chatSub = this.chatService.getDriverSubscriber()
      .subscribe(data => {
        if (data) {
          this.socketService.chatInfo.push(data);
          data.passenger.forEach((value: any) => {
            this.createConnection(value.email);
          })
        }
      });
    const role = this.userService.getUserRole();

    if (role[0] === 'DRIVER') {
      this.role = role[0];
    }
    this.userEmail = this.chatService.getUserEmail();
    this.getInfoWithChatDto();
    // this.createConnection();
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
    this.chatInfoDto['userEmail'] = this.userEmail;
    this.chatInfoDto['receiverEmail'] = this.receiverEmail;

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
      if (data) {
        // @ts-ignore
        data.passenger.forEach(value => {
          infoUsers.push(value);
        })
      }
    });
    const sortedArray = infoUsers.reverse();
    return sortedArray;
  }

  getUniqueReceiver() {
    const uniqueEmail: string[] = [];
    this.socketService.chatInfo.map(data => {
      if (data) {
        // @ts-ignore
        data.passenger.forEach(value => {
          if (value.email !== this.userEmail) {
            uniqueEmail.push(value.email);
          }
        })
      }
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
    this.messSub = this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
        this.warningService.sendWarning(`Сообщение ${this.splitEmail(this.receiverEmail)} отравлено`);
      },
      error => this.warningService.sendWarning(`Ошибка отправки сообщения ${this.receiverEmail}`));
    // @ts-ignore
    this.chatInfoDto['userEmail'] = this.chatInfoDto['receiverEmail'];
    this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
      console.log(data);
    })
  }

  onScrollDown() {
    if (!this.showSpinner) {
      this.showSpinner = true
      this.imagesPage += 1;
      this.chatSub = this.chatService.getDriverSubscriber()
        .subscribe(data => {
          this.socketService.chatInfo.push(data);
        });
    }
  }

  splitEmail(email: string) {
    const splitEmail = email.split('@');
    return splitEmail[0];
  }
}
