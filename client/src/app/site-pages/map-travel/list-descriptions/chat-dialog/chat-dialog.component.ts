import {Component, Inject, OnInit} from '@angular/core';
import {ChatService} from "../../../chat/chat.service";
import {WarningService} from "../../../../shared/services/warning.service";
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SocketMessageDto} from "../../../../shared/interfaces";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent {
  //@ts-ignore
  message: string;
  //@ts-ignore
  chatInfoDto: SocketMessageDto;

  constructor(private chatService: ChatService,
              private warningService: WarningService,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<any>) {
  }

  saveMessage() {
    const email = this.userService.getUserDataFromLocal();
    if (email === this.data) {
      this.warningService.sendWarning('Вы не можете писать себе');
      return;
    }
    else {
      if (typeof (this.data) === 'string') {
        this.formatSendObject(this.data, email);
      } else {
        this.data.forEach((value: string) => {
          this.formatSendObject(value, email);
        });
      }
    }
  }

  private formatSendObject(dataEmail: string, email: string) {
    this.chatInfoDto = {
      userEmail: dataEmail,
      receiverEmail: email,
      passenger: [{
        email: email,
        message: this.message,
        receiverEl: dataEmail,
        // @ts-ignore
        date: Date.now()
      }]
    }
    this.saveInDb();
  }

  private saveInDb() {
    this.chatService.saveMessage(this.chatInfoDto)
      .pipe(
        switchMap(() => {
          //@ts-ignore
          this.chatInfoDto['userEmail'] = this.chatInfoDto['receiverEmail'];
         return this.chatService.saveMessage(this.chatInfoDto)
        })
      )
      .subscribe(() => {
        this.warningService.sendWarning(`Сообщение отравлено`)
      },
      error => this.warningService.sendWarning(`Ошибка отправки сообщения`, error));
    this.dialogRef.close({isMessageSend: true});
  }
}
