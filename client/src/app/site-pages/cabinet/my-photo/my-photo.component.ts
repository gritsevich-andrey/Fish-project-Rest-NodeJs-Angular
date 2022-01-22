import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Photo} from "../../../shared/interfaces";
import {SortService} from "../../../shared/services/sort.service";
import {CabinetService} from "../cabinet.service";
import {UserService} from "../../../shared/services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteModalComponent} from "./delete-modal/delete-modal.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Lightbox} from "ngx-lightbox";

@Component({
  selector: 'app-my-photo',
  templateUrl: './my-photo.component.html',
  styleUrls: ['./my-photo.component.scss']
})
export class MyPhotoComponent implements OnInit, OnDestroy {
userPhotos: Photo[] = [];
  page = 1;
  pageSize: number = 15;
  private countPage = 1;
  private email = '';
  private subCab?: Subscription;
  isOrganizer = false;
  @Input() organizerEmail = '';
  private _albums: Array<any> = [];
  constructor(public sortService: SortService,
              private cabinetService: CabinetService,
              private userService: UserService,
              private dialog: MatDialog,
              private router: ActivatedRoute) {
  }
  ngOnDestroy(): void {
       if(this.subCab) {
         this.subCab.unsubscribe();
       }
    }

  ngOnInit(): void {
    this.router.params.subscribe(data => {
      if (data.email) {
        console.log('Дата', data.email);
        this.email = this.organizerEmail;
        this.isOrganizer = true;
      }
      else {
        this.email = this.userService.getUserDataFromLocal();
      }
    })
    this.getMyPhoto();
  }
  private getMyPhoto() {
   this.subCab = this.cabinetService.getPhotoByUserEmail(this.email, this.pageSize, this.countPage).subscribe(data => {
      if(data) {
        this.userPhotos.length = 0;
        data.map((value: any) => {
          if(!value.queryDeleted) {
            this.userPhotos.push(
              {
                id: value._id,
                userEmail: value.userEmail,
                description: value.description,
                imageSrc: value.imageSrc,
                moderation: value.moderation,
                public: value.public,
                queryDeleted: value.queryDeleted
              });
          }
        });
        console.log('Фото', this.userPhotos);
      }
    })
  }
  handlePageChange() {
    this.getMyPhoto();
    this.countPage += 1;
  }

  deleteImage(id: string) {
    this.openDialogConfirm(id);
  }

  openDialogConfirm(id: string) {
    const dialogRef = this.dialog.open(DeleteModalComponent,
      {
        data: id
      }
    );
    dialogRef.afterClosed().subscribe(data => {
        this.userPhotos = [];
        this.getMyPhoto()
    },
      error => console.error('Ошибка получения изображений из базы', error)
      );
  }
}
