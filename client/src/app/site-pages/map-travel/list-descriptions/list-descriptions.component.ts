import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Travel} from "../../../shared/interfaces";
import {MatDialog} from "@angular/material/dialog";
import {ChatDialogComponent} from "./chat-dialog/chat-dialog.component";
import {CabinetService} from "../../cabinet/cabinet.service";
import * as CryptoJS from 'crypto-js';
import {UserService} from "../../../shared/services/user.service";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {filter, tap} from "rxjs/operators";

@Component({
  selector: 'app-list-descriptions',
  templateUrl: './list-descriptions.component.html',
  styleUrls: ['./list-descriptions.component.scss']
})
export class ListDescriptionsComponent {
  //@ts-ignore
  @Input() travels: Travel;
  @Input() travelSelect?: any[];
  imageNull = 'uploads/avatar.jpg';
  @Output()
  private chatMessageSuccess = new EventEmitter();

  constructor(public dialog: MatDialog,
              private cabinetService: CabinetService,
              private userService: UserService,
              private authService: AuthService,
              private router: Router
  ) {
  }


  /**/
  getTechNames() {
    //@ts-ignore
    return JSON.parse(this.travels.travelTechnique).map((tech: any) => tech.name).join(', ')
  }

  openChatDialog(receiverEmail: string) {
    const dialogRef = this.dialog.open(ChatDialogComponent,
      {
        data: receiverEmail
      }
    );
    dialogRef.afterClosed()
      .pipe(
        filter(value => !!value),
        tap(() => this.chatMessageSuccess.emit())
      )
      .subscribe();
  }

  goJoin(userEmail: string, _id: string) {
    const email = this.userService.getUserDataFromLocal();
    const pass = this.authService.getToken();
    const data = `${userEmail}/${_id}/${email}`
    const dataCrypt = CryptoJS.AES.encrypt(data, pass).toString();
    this.router.navigate(['/join', dataCrypt]);
  }
}
