import {Component, Inject} from '@angular/core';
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
export class ChatDialogComponent {
  //@ts-ignore
  message: string;
  //@ts-ignore
  chatInfoDto: SocketMessageDto;
  constructor(private chatService: ChatService,
              private warningService: WarningService,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  saveMessage() {
    const email = this.userService.getUserDataFromLocal();
    if(this.message && (email !== this.data)){
      this.chatInfoDto = {
        userEmail: this.data,
        receiverEmail: email,
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
      this.warningService.sendWarning(`Вы не можете писать сообщения себе`);
    }
  }

  private saveInDb() {
     this.chatService.saveMessage(this.chatInfoDto).subscribe(data => {
         console.log('Объект для отправки в базу', this.chatInfoDto);
        console.log('Данные полученные из базы через диалог в базу', data);
      this.warningService.sendWarning(`Сообщение отравлено`);
      },
      error => this.warningService.sendWarning(`Ошибка отправки сообщения`, error));
  }
}
