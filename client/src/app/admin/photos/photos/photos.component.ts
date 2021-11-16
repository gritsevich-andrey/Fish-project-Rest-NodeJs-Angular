import {Component, OnInit} from '@angular/core';
import { MaterialService } from 'src/app/shared/classes/material.service';
import {PhotoService} from "../../../shared/services/fotos.service";
import {EmitterService} from "../../../shared/services/emitter.service";


declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  page: number = 1;
  usersOnPage!: number;
  defaultUsersOnPage: number = 10;
  searchValue!: string;
  photosData: any[] = [];
  emailsArray: string[] = []


  constructor(private photoService: PhotoService,
              private emitterService: EmitterService) {
  }

  ngOnInit(): void {
    this.initFormSelect()
    this.getPhotos()
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  getPhotos() {
    this.photoService.getPhotos().subscribe(
      data => {
        this.photosData = data
        this.emailsArray = data.map((el: any) => el.userEmail)
        this.getEmailFIO(this.emailsArray)
      },
      error => console.log(error));
  }

  getEmailFIO(emailsArray: any) {
    this.photoService.getFIO(emailsArray).subscribe(
      (data: any) => {
        this.photosData.forEach(el => {
          data.forEach((elem: any) => {
            if (el.userEmail === elem.email) {
              el.fio = elem.fio;
            }
          })
        })
      },
      error => console.log(error));
  }

  setPublic(fotoId: string, isPublic: boolean) {
    this.photosData.forEach(el => {
      if (el.fotoId === fotoId) {
        el.public = isPublic;
        //this.updatePhotoInfo(el)
      }
    })
  }

  setModeration(fotoId: string, moderation: boolean) {
    this.photosData.forEach(el => {
      if (el.fotoId === fotoId) {
        el.moderation = moderation;
        //this.updatePhotoInfo(el)
      }
    })
  }

  updatePhotoInfo(photoInfo: any) {
    this.photoService.updatePhotoInfo(photoInfo).subscribe(
      data => {
        if(data) {
         this.emitterService.eventEmitterSubject$.next({action: 'CREATE', payload: data});
         this.emitterService.changeCount({action: 'CREATE', payload: data});
        console.log('Генерация события', data);
        }
        MaterialService.toast('Изменения сохранены')
      },
      error => console.log(error)
    )
  }
}
