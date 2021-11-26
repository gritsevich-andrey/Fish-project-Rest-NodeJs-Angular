import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";

@Component({
  selector: 'app-list-descriptions',
  templateUrl: './list-descriptions.component.html',
  styleUrls: ['./list-descriptions.component.scss']
})
export class ListDescriptionsComponent implements OnInit {
  //@ts-ignore
@Input() travels: Travel;
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
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
