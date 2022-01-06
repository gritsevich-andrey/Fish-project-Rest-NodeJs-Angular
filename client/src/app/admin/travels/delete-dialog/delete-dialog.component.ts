import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ChatService} from "../../../site-pages/chat/chat.service";
import {WarningService} from "../../../shared/services/warning.service";
import {UserService} from "../../../shared/services/user.service";
import {SocketMessageDto} from "../../../shared/interfaces";
import {TravelService} from "../../shared/services/travel.service";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit{
//@ts-ignore
  message: string;
  //@ts-ignore
  chatInfoDto: SocketMessageDto;
  private travelId: string = '';
  private dataEmails: string[]=[];
  constructor(
    private chatService: ChatService,
    private warningService: WarningService,
    private userService: UserService,
    private travelService: TravelService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  saveMessage() {
    const email = this.userService.getUserDataFromLocal();
      this.dataEmails.forEach((value: string) => {
        this.formatSendObject(value, email);
      });
    this.deleteTrip();
  }

  private formatSendObject(dataEmail:string, email: string) {
    this.chatInfoDto = {
      userEmail: dataEmail,
      receiverEmail: email,
      passenger: [{
        email: email,
        message: 'МОДЕРАТОР: ' + this.message,
        // @ts-ignore
        date: Date.now()
      }]
    }
    this.saveInDb();
  }

  private saveInDb() {
    this.chatService.saveMessage(this.chatInfoDto).subscribe(()=>this.warningService.sendWarning(`Сообщение отравлено`),
      error => this.warningService.sendWarning(`Ошибка отправки сообщения`, error));
  }
  private deleteTrip() {
    this.travelService.deleteTravel(this.travelId).subscribe(
      error => this.warningService.sendWarning(`Ошибка удаления поездки`, error));
  }

  ngOnInit(): void {
    this.travelId = this.data.travelId;
    this.dataEmails = this.data.userEmails;
  }
}
