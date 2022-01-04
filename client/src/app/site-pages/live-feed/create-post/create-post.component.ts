import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialService} from "../../../shared/classes/material.service";
import {PhotoService} from "../../../shared/services/photo.service";
import {ViewPointMapComponent} from "../view-point-map/view-point-map.component";
import {SetPointMapComponent} from "../set-point-map/set-point-map.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  @Input()
  userEmail: string = ''

  form!: FormGroup;
  file!: File;

  constructor(
    private photoService: PhotoService,
    public dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      description: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  createPost() {
    if (this.form.valid) {
      const postData = {
        file: this.form.controls.file.value,
        email: this.userEmail,
        description: this.form.controls.description.value,
        latitude: this.form.controls.latitude.value,
        longitude: this.form.controls.longitude.value,
        public: true
      }
      this.photoService.createPhoto(postData).subscribe(
        () => {
          MaterialService.toast('Ваш пост был отправлен на модерацию')
          this.resetForm()
        },
        error => {
          MaterialService.toast('Ошибка при загрузке на сервер')
          console.log(error)
        }
      );
    } else {
      MaterialService.toast('Укажите и/или загрузите все данные')
    }
  }

  onFileLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file})
  }

  resetForm() {
    this.form.controls.description.reset();
    this.form.controls.file.reset();
  }

  openMap() {
    const dialogRef = this.dialog.open(SetPointMapComponent);
    dialogRef.afterClosed().subscribe(({latitude, longitude, address}) => {
      this.form.patchValue({latitude, longitude, address})
    });
  }
}
