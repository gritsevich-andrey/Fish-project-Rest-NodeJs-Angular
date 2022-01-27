import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Photo} from "../../../shared/interfaces";
import {SortService} from "../../../shared/services/sort.service";
import {CabinetService} from "../cabinet.service";
import {UserService} from "../../../shared/services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteModalComponent} from "./delete-modal/delete-modal.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Properties} from "@crystalui/angular-lightbox/lib/interfaces";
import {PhotoService} from "../../../shared/services/photo.service";
import {WarningService} from "../../../shared/services/warning.service";

@Component({
  selector: 'app-my-photo',
  templateUrl: './my-photo.component.html',
  styleUrls: ['./my-photo.component.scss']
})
export class MyPhotoComponent implements OnInit, OnDestroy {
  userPhotos: Photo[] = [];
  page = 1;
  pageSize: number = 15;
  pagePhoto = 1;
  pageSizePhoto = 30;
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
  photoChecked: any[] = [];

  constructor(public sortService: SortService,
              private cabinetService: CabinetService,
              private userService: UserService,
              private dialog: MatDialog,
              private router: ActivatedRoute,
              private photoService: PhotoService,
              private warningService: WarningService) {
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
      }
    })
  }

  // handlePageChange() {
  //   this.getMyPhoto();
  //   this.countPage += 1;
  // }

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

  selectItem(event: any, id: string) {
    const checked = event;
    let newArray: any[] = [];
    if (this.photoChecked.length === 0)
    {
      this.photoChecked.push({id, checked});
      return;
    }
    else {
      const filterArray = this.photoChecked.filter((value: any) => {
       return value.id !== id;
      });
      filterArray.push({id, checked})
      newArray = filterArray;
    }
this.photoChecked = newArray;
  }

  updatePhotoPublic() {
    if(this.photoChecked.length > 0)
    {
      this.photoChecked.forEach(value => {
        this.photoService.updatePhotoPublic({id: value.id , public: value.checked}).subscribe(data => {
          if(data)
          {
            this.photoChecked.length = 0;
          }
        });
      });
      this.warningService.sendWarning('Настройки успешно сохранены');
    }
  }
}
