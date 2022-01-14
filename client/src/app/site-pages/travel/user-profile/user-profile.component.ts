import {Component, Inject, Input, OnInit} from '@angular/core';
import {CabinetService} from "../../cabinet/cabinet.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  loading = true;
  userCabinet!: any;
  imagePreview = 'uploads/avatar.jpg';
  averageRating = 0
  reviewsPage = 1;

  constructor(
    private cabinetService: CabinetService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.getUserCabinet(this.data.email)
  }

  getUserCabinet(userEmail: string) {
    this.cabinetService.getCabinetData(userEmail).subscribe(cabinet => {
      this.userCabinet = cabinet;
      this.loading = false
    })
  }

  getAverageRating() {
    this.averageRating = Math.round(((this.userCabinet.ratings.reduce(
      (prev: number, current: any) => current.sumValue + prev,
      0)) / this.userCabinet.ratings.length))
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
