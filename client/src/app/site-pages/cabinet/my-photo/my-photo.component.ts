import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Photo} from "../../../shared/interfaces";
import {SortService} from "../../../shared/services/sort.service";
import {CabinetService} from "../cabinet.service";
import {UserService} from "../../../shared/services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteModalComponent} from "./delete-modal/delete-modal.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CrystalLightboxModule} from '@crystalui/angular-lightbox';
import {Properties} from "@crystalui/angular-lightbox/lib/interfaces";

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
  cristalLightboxProp: Properties = {
    imageMaxHeight: "100%",
    imageMaxWidth: "100%",
    counter: false,
    counterSeparator: "/",
    backgroundOpacity: 0.85,
    animationDuration: 400,
    animationTimingFunction: "cubic-bezier(0.475, 0.105, 0.445, 0.945)",
    hideThumbnail: true,
    disable: false,
    closeButtonText: "Закрыть"
  }
  isVisible: boolean = false;
emailForPhoto = this.userService.getUserDataFromLocal();
  constructor(public sortService: SortService,
              private cabinetService: CabinetService,
              private userService: UserService,
              private dialog: MatDialog,
              private router: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    if (this.subCab) {
      this.subCab.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.router.params.subscribe(data => {
      if (data.email) {
        this.email = this.organizerEmail;
        this.isOrganizer = true;
      } else {
        this.email = this.userService.getUserDataFromLocal();
      }
    })
    this.getMyPhoto();
  }

  private getMyPhoto() {
    this.subCab = this.cabinetService.getPhotoByUserEmail(this.email, this.pageSize, this.countPage).subscribe(data => {
      if (data) {
        this.userPhotos.length = 0;
        data.map((value: any) => {
          if (!value.queryDeleted) {
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
