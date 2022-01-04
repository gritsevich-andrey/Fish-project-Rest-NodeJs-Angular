import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {PhotoService} from "../../shared/services/photo.service";
import {MaterialService} from "../../shared/classes/material.service";
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ViewPointMapComponent} from "./view-point-map/view-point-map.component";
import {LiveFeedPost} from "../../shared/interfaces";

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  posts!: LiveFeedPost[];
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
    private photoService: PhotoService,
    public dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      //Нужно добавить валидатор
      description: new FormControl(''),
      file: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.likeCount = JSON.parse(localStorage.getItem('likes') || '[]')
    this.userEmail = this.userService.getUserDataFromLocal()
    this.getPhotos()
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //NEED TO FIX
    //this.likeCount.forEach((imageId: any) => this.photoService.updateLikes(imageId))
    //localStorage.setItem('likes', JSON.stringify(this.likeCount))
  }

  setLike(imageId: string, isLiked: boolean) {
    if (!isLiked) {
      this.likeCount.push(imageId)
      this.posts.forEach(post => {
        if (post.imageId === imageId) {
          post.isLiked = true
          post.likeCount += 1
        }
      })
    } else {
      const index = this.likeCount.findIndex((likeImageId: string) => likeImageId === imageId)
      this.likeCount.splice(index, 1)

      this.posts.forEach(post => {
        if (post.imageId === imageId) {
          post.isLiked = false
          post.likeCount -= 1
        }
      })
    }
  }

  getPhotos() {
    this.photoService.getFeedPhotos(this.postsOnPage, 1).pipe(map(posts => {
      return posts.map((post: LiveFeedPost) => {
        post.isLiked = this.likeCount.includes(post.imageId)
        return post
      })
    })).subscribe(
      posts => {
        debugger
        this.posts = posts
      },
      error => console.log(error)
    )
  }

  getComments(imageId: string, showComments: boolean) {
    if (showComments) {
      this.photoService.getComments(imageId).subscribe(
        data => {
          this.posts.forEach(post => {
            if (post.imageId === imageId) {
              if (data.length === 0) post.comments = [{commentValue: 'Комментрариев нет'}]
              else post.comments = data
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
          this.posts.push(...data)
          this.showSpinner = false
          if (data.length === 0) {
            this.isAllPosts = true
          }
        },
        error => console.log(error)
      )
    }
  }

  openMap(latitude: number, longitude: number) {
    const dialogRef = this.dialog.open(ViewPointMapComponent,
      {
        data: {
          latitude,
          longitude
        }
      }
    );
    dialogRef.afterClosed().subscribe();
  }
}
