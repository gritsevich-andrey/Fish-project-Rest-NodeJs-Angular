import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-accept-join',
  templateUrl: './accept-join.component.html',
  styleUrls: ['./accept-join.component.scss']
})
export class AcceptJoinComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<any>
  ) {
  }

  ngOnInit(): void {
  }

  join() {
    this.dialog.close({accept: true})
  }

  close() {
    window.close()
  }

}
