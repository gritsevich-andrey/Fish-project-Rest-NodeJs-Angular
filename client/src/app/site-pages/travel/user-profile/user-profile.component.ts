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
  averageRating = 0;
  reviewsPage = 1;

  constructor() {
  }

  ngOnInit(): void {
    if (this.userCabinet.avatar)
      this.imagePreview = this.userCabinet.avatar
    this.averageRating = this.userCabinet.reduce((prev: number, current: any) => {
      return current.sumValue + prev
    }, 0)
  }

}
