import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {ChatDialogComponent} from "./chat-dialog/chat-dialog.component";

@Component({
  selector: 'app-list-descriptions',
  templateUrl: './list-descriptions.component.html',
  styleUrls: ['./list-descriptions.component.scss']
})
export class ListDescriptionsComponent implements OnInit {
  //@ts-ignore
@Input() travels: Travel;
  imageNull = 'uploads/avatar.jpg';
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.travels);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,
    //   {
    //   width: '250px'
    // }
    );
    dialogRef.afterClosed().subscribe();
  }
  openChatDialog(receiverEmail: string) {
    const dialogRef = this.dialog.open(ChatDialogComponent,
        {
        data: receiverEmail
      }
    );
    dialogRef.afterClosed().subscribe();
  }
}
