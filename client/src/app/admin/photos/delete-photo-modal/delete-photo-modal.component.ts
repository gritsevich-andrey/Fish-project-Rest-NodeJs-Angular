import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PhotoService} from "../../../shared/services/photo.service";
import {MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-delete-photo-modal',
  templateUrl: './delete-photo-modal.component.html',
  styleUrls: ['./delete-photo-modal.component.scss']
})
export class DeletePhotoModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private photoService: PhotoService
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.photoService.deletePhoto(this.data.id).subscribe(
      () => MaterialService.toast('Фотография удалена'),
      error => {
        MaterialService.toast('Ошибка удаления')
        console.log(error)
      }
    )
  }
}
