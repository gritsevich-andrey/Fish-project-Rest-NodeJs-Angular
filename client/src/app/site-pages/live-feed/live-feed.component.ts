import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {PhotoService} from "../../shared/services/photo.service";
import {MaterialService} from "../../shared/classes/material.service";

interface Photos {
  imageSrc: string
  userEmail: string
  description: string
  readMore: boolean
  showComments: boolean
  comments: any
  imageId: string
  comment: string
  likeCount: number
  isLiked: boolean
  date: string
}

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  photos!: Photos[];
  userEmail!: string;
  file!: File;
  form!: FormGroup;
  imagesOnPage = 10;
  imagesPage = 1;
  showSpinner = false;
  isAllPictures = false;

  constructor(
    private userService: UserService,
    private photoService: PhotoService
  ) {
    this.form = new FormGroup({
      //Нужно добавить валидатор
      description: new FormControl(''),
      file: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.getUserDataFromLocal();
    this.getPhotos()
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.photoService.likeCount.forEach((el: any) => this.photoService.updateLikes(el.imageId, el.likeCount))
    this.photoService.likeCount = []
  }

  setLike(imageId: string, likeCount: number, isLiked: boolean) {
    if (!isLiked) {
      this.photoService.likeCount.push({imageId})
      this.photos.forEach(el => {
        if (el.imageId === imageId) {
          el.isLiked = true
          el.likeCount = likeCount
        }
      })
    }
  }

  getPhotos() {
    this.photoService.getFeedPhotos(this.imagesOnPage, 1).subscribe(
      data => this.photos = data,
      error => console.log(error)
    )
  }

  sendFile() {
    const photoData = {
      file: this.form.controls.file.value,
      email: this.userEmail,
      description: this.form.controls.description.value,
      public: true
      //coordinates: 'где-то нужно взять'
    }
    if (!photoData.file && !photoData.description) MaterialService.toast('Ваш пост не должен быть пустым')
    else if (!photoData.file) MaterialService.toast('Ваш пост должен содержать изображение')
    else {
      this.photoService.createPhoto(photoData).subscribe(
        () => MaterialService.toast('Ваш пост был отправлен на модерацию'),
        error => {
          MaterialService.toast('Ошибка при загрузке на сервер')
          console.log(error)
        }
      );
      this.resetForm()
    }
  }

  resetForm() {
    this.form.controls.description.reset();
    this.form.controls.file.reset();
  }

  onFileLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    debugger
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.form.patchValue({file: reader.result});
    // }
    // reader.readAsDataURL(file);
    this.form.patchValue({file: new Blob([file], { type: file.type})});

  }

  getComments(imageId: string, showComments: boolean) {
    if (showComments) {
      this.photoService.getComments(imageId).subscribe(
        data => {
          this.photos.forEach(el => {
            if (el.imageId === imageId) {
              if (data.length === 0) el.comments = [{commentValue: 'Комментрариев нет'}]
              else el.comments = data
            }
          })
        },
        error => console.log(error))
    }
  }

  sendComment(imageId: string, commentValue: string) {
    this.photoService.setComment(imageId, commentValue, this.userEmail).subscribe(
      () => {
        MaterialService.toast('Ваш комментарий отправлен')
        this.getComments(imageId, true)
      },
      error => {
        MaterialService.toast('Ошибка отправки комментария')
        console.log(error)
      }
    )
  }

  onScrollDown() {
    if (!this.showSpinner && !this.isAllPictures) {
      this.showSpinner = true
      this.imagesPage += 1;
      this.photoService.getFeedPhotos(this.imagesOnPage, this.imagesPage).subscribe(
        data => {
          this.photos.push(...data)
          this.showSpinner = false
          if (data.length === 0) {
            this.isAllPictures = true
          }
        },
        error => console.log(error)
      )
    }
  }
}
