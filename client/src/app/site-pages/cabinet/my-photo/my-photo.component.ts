import {Component, Input, OnInit} from '@angular/core';
import {Photo} from "../../../shared/interfaces";
import {SortService} from "../../../shared/services/sort.service";
import {CabinetService} from "../cabinet.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-my-photo',
  templateUrl: './my-photo.component.html',
  styleUrls: ['./my-photo.component.scss']
})
export class MyPhotoComponent implements OnInit {
userPhotos: Photo[] = [];
  page = 0;
  pageSize: number = 5;
  private countPage = 0;
  private email = '';
  constructor(public sortService: SortService,
              private cabinetService: CabinetService,
              private userService: UserService) {
    this.email = this.userService.getUserDataFromLocal();
  }

  ngOnInit(): void {
    this.getMyPhoto();
  }
  private getMyPhoto() {
    this.cabinetService.getPhotoByUserEmail(this.email, this.pageSize, this.countPage).subscribe(data => {
      if(data) {
        data.map((value: any) => {
          this.userPhotos.push(
            {
              userEmail: value.userEmail,
              description: value.description,
              imageSrc: value.imageSrc,
              moderation: value.moderation,
              public: value.public
            });
        })
      }
    })
  }
  handlePageChange() {
    this.getMyPhoto();
    this.countPage += 1;
  }
}
