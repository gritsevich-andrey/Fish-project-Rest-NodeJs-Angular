import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {PhotoService} from "../../shared/services/photo.service";
import {MaterialService} from "../../shared/classes/material.service";
import {map} from "rxjs/operators";

interface Post {
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
  photos!: Post[];
  userEmail!: string;
  file!: File;
  form!: FormGroup;
  postsOnPage = 10;
  postsPage = 1;
  showSpinner = false;
  isAllPosts = false;
  likeCount: any = [];

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
    this.likeCount = JSON.parse(localStorage.getItem('likes') || '[]')
    debugger
    this.userEmail = this.userService.getUserDataFromLocal()
    this.getPhotos()
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.likeCount.forEach((imageId: any) => this.photoService.updateLikes(imageId))
    localStorage.setItem('likes', JSON.stringify(this.likeCount))
  }

  setLike(imageId: string, isLiked: boolean) {
    if (!isLiked) {
      this.likeCount.push(imageId)
      this.photos.forEach(photo => {
        if (photo.imageId === imageId) {
          photo.isLiked = true
          photo.likeCount += 1
        }
      })
    } else {
      const index = this.likeCount.findIndex((likeImageId: string) => likeImageId === imageId)
      this.likeCount.splice(index, 1)

      this.photos.forEach(photo => {
        if (photo.imageId === imageId) {
          photo.isLiked = false
          photo.likeCount -= 1
        }
      })
    }
  }

  getPhotos() {
    this.photoService.getFeedPhotos(this.postsOnPage, 1).pipe(map(posts => {
      return posts.map((post: Post) => {
        post.isLiked = this.likeCount.includes(post.imageId)
        return post
      })
    })).subscribe(
      posts => {
        this.photos = posts
      },
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
    }
    this.resetForm()
  }

  resetForm() {
    this.form.controls.description.reset();
    this.form.controls.file.reset();
  }

  onFileLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file})
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
    if (!this.showSpinner && !this.isAllPosts) {
      this.showSpinner = true
      this.postsPage += 1;
      this.photoService.getFeedPhotos(this.postsOnPage, this.postsPage).subscribe(
        data => {
          this.photos.push(...data)
          this.showSpinner = false
          if (data.length === 0) {
            this.isAllPosts = true
          }
        },
        error => console.log(error)
      )
    }
  }
}
