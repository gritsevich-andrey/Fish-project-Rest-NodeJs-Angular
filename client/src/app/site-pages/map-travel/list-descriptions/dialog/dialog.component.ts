import {Component, Inject, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../shared/services/user.service";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MaterialService} from "../../../../shared/classes/material.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  complaintDescription!: string;
  inputValue: string = ''

  complaintTypes = ['не выходит на связь', 'хамит', 'мошенник', 'реклама', 'другое']

  constructor(
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: {userEmail: string}
  ) {
  }

  ngOnInit(): void {
  }

  onChange(type: string) {
    this.complaintDescription = type
  }

  save() {
    let description

    if (this.complaintDescription === 'другое') description = this.inputValue
    else description = this.complaintDescription

    this.userService.createComplaint({description, email: this.data.userEmail}).subscribe(
      () => MaterialService.toast('Ваша жалоба отправлена'),
      error => console.log(error)
    )
  }

  // dialogClose() {
  //   this.dialogRef.close();
  // }
}
