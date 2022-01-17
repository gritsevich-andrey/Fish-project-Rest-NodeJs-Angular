import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PhotoService} from "../../../../shared/services/photo.service";
import {UserService} from "../../../../shared/services/user.service";
import {MyPhotoComponent} from "../my-photo.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit, OnDestroy {
  private sub?: Subscription;

  constructor(
    @Optional()  @Inject(MAT_DIALOG_DATA) public id: string,
    private photoService: PhotoService,
    private userService: UserService,
    public dialogRef: MatDialogRef<MyPhotoComponent>) { }

  ngOnInit(): void {
  }

  updateLiveFeed() {
   const email = this.userService.getUserDataFromLocal();
   const transferObj = {
     userEmail: email,
     fotoId: this.id,
     queryDeleted: true
   }
   this.sub = this.photoService.updatePhotoInfo(transferObj).subscribe( data => console.log('Данные из диалога', data));
      this.dialogRef.close({ data: true });
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
