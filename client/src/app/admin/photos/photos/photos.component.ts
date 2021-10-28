import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../../shared/services/fotos.service";

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


  constructor(private photoService: PhotoService) {
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
        debugger
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
        this.updateFotoInfo(el)
      }
    })
  }

  setModeration(fotoId: string, moderation: boolean) {
    this.photosData.forEach(el => {
      if (el.fotoId === fotoId) {
        el.moderation = moderation;
        this.updateFotoInfo(el)
      }
    })
  }

  updateFotoInfo(photoInfo: any) {
    this.photoService.updateFotoInfo(photoInfo).subscribe(
      data => {
        console.log(data)
        this.getPhotos()
      },
      error => console.log(error)
    )
  }
}
