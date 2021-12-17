import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input()
  userCabinet!: any;
  imagePreview = 'uploads/avatar.jpg';
  averageRating = 0
  reviewsPage = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

  getAverageRating() {
    this.averageRating = Math.round(((this.userCabinet.ratings.reduce((prev: number, current: any) => {
      return current.sumValue + prev
    }, 0)) / this.userCabinet.ratings.length))
  }

  getImage() {
    //must use
    if (this.userCabinet?.avatar) {
      return this.imagePreview = this.userCabinet.avatar
    } else {
      return this.imagePreview
    }
  }

}
