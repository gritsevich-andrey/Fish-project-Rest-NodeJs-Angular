import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ChatService} from "../../../chat/chat.service";
import {WarningService} from "../../../../shared/services/warning.service";
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SocketMessageDto} from "../../../../shared/interfaces";
@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnDestroy {
  messSub!: Subscription;
  //@ts-ignore
  message: string;
  //@ts-ignore
  chatInfoDto: SocketMessageDto;
  constructor(private chatService: ChatService,
              private warningService: WarningService,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnDestroy(): void {
        this.messSub.unsubscribe();
    }

  saveMessage() {
    const email = this.userService.getUserDataFromLocal();
    if(this.message){
      this.chatInfoDto = {
        userEmail: email,
        receiverEmail: this.data,
        passenger: [{
          email: email,
          message: this.message,
          // @ts-ignore
          date: Date.now()
        }]
      }
      this.saveInDb();
    }
    else {
      this.warningService.sendWarning(`Ошибка отправки сообщения`);
    }
  }

  private saveInDb() {
    this.messSub = this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
        this.warningService.sendWarning(`Сообщение отравлено`);
      },
      error => this.warningService.sendWarning(`Ошибка отправки сообщения`, error));
  }
}
