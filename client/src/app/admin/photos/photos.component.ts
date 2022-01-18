import {Component, OnInit} from '@angular/core';
import {MaterialService} from 'src/app/shared/classes/material.service';
import {EmitterService} from "../../shared/services/emitter.service";
import {PhotoService} from "../../shared/services/photo.service";
import {PhotoAdmin} from "../../shared/interfaces";
import {DeletePhotoModalComponent} from "./delete-photo-modal/delete-photo-modal.component";
import {MatDialog} from "@angular/material/dialog";


declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  page: number = 1;
  photosOnPage!: number;
  defaultPhotosOnPage: number = 10;
  searchValue!: string;
  photos: PhotoAdmin[] = [];
  deleteRequestPhotos: PhotoAdmin[] = [];
  emailsArray: string[] = []


  constructor(
    private photoService: PhotoService,
    private emitterService: EmitterService,
    private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.initFormSelect()
    this.getPhotos();
    this.emitterService.change$.subscribe(state => console.log('подписка в фото', state));
    this.emitterService.isAuthenticated$.subscribe(authenticated => {
      if (authenticated) {
        console.log('Аутентификация')
      }
    });

  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  getPhotos() {
    this.photoService.getPhotos().pipe().subscribe(
      (photos: PhotoAdmin[]) => {
        this.photos = photos.filter(photo => !photo.queryDeleted)
        this.deleteRequestPhotos = photos.filter(photo => photo.queryDeleted)
        this.emailsArray = photos.map((photo: any) => photo.userEmail)
        this.getEmailFIO(this.emailsArray)
      },
      error => console.log(error));
  }

  getEmailFIO(emailsArray: any) {
    this.photoService.getFIO(emailsArray).subscribe(
      (FIOs: any) => {
        this.photos.forEach(photo => {
          FIOs.forEach((FIO: any) => {
            if (photo.userEmail === FIO.email) {
              photo.fio = FIO.fio;
            }
          })
        })
      },
      error => console.log(error));
  }

  setPublic(photoId: string, isPublic: boolean) {
    this.photos.forEach(photo => {
      if (photo._id === photoId) {
        photo.public = isPublic;
        //this.updatePhotoInfo(el)
      }
    })
  }

  setModeration(photoId: string, moderation: boolean) {
    this.photos.forEach(photo => {
      if (photo._id === photoId) {
        photo.moderation = moderation;
        //this.updatePhotoInfo(el)
      }
    })
  }

  updatePhotoInfo(photoInfo: any) {
    this.photoService.updatePhotoInfo(photoInfo).subscribe(
      data => {
        if (data) {
          this.emitterService.setState(22);
          this.emitterService.changeAuthenticated();
        }
        MaterialService.toast('Изменения сохранены')
      },
      error => console.log(error)
    )
  }

  openDeleteModal(id: string) {
    const dialogRef = this.dialog.open(DeletePhotoModalComponent, {
      data: {id}
    });
    dialogRef.afterClosed().subscribe(({photoId}) => {
      let index = this.deleteRequestPhotos.findIndex(photo => photo._id === photoId)
      this.deleteRequestPhotos.splice(index, 1)
    });
  }
}
