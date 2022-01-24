import {Component, OnInit} from '@angular/core';
import { MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-accept-join',
  templateUrl: './accept-join.component.html',
  styleUrls: ['./accept-join.component.scss']
})
export class AcceptJoinComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<any>
  ) {
  }

  ngOnInit(): void {
  }

  join() {
    this.dialog.close({accept: true})
  }

}
