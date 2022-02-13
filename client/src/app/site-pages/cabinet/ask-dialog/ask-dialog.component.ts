import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-ask-dialog',
  templateUrl: './ask-dialog.component.html',
  styleUrls: ['./ask-dialog.component.scss']
})
export class AskDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AskDialogComponent>) { }

  ngOnInit(): void {
  }

  deleteTechnique() {
    this.dialogRef.close('yes');
  }

  onNoClick() {
    this.dialogRef.close('no');
  }
}
