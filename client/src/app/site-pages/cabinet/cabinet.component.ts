import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {UserService} from "../../shared/services/user.service";
import {CabinetService} from "./cabinet.service";
import {Photo} from "../../shared/interfaces";
import {SortService} from "../../shared/services/sort.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit, OnDestroy {
  // https://www.bezkoder.com/ngx-pagination-angular-8/
  //@ts-ignore
  public techList: FormArray;
  form!: FormGroup;
  hide = true;
  imagePreview = 'uploads/avatar.jpg';
  borderState = 'end';
  flag: boolean = false;
  isNew = true;
  file!: File;
  userPhotos: Photo[] = [];
  //@ts-ignore
  @ViewChild('addTech', {static: false}) techRef: ElementRef;
  rating: any;
  rating3: number;
  public formRating: FormGroup;
  private photoSub!: Subscription;
  page = 0;
  pageSize: number = 5;
  email = this.userService.getUserDataFromLocal();
  countPage = 1;
  reviews: any[] = [];
  ratings: any[] = [];
  //@ts-ignore
  sumRating: number;

  constructor(private warningService: WarningService,
              private cabinetService: CabinetService,
              private userService: UserService,
              private fb: FormBuilder,
              public sortService: SortService) {

    this.form = new FormGroup({
      fio: new FormControl('', Validators.required),
      avatar: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      gender: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      technique: new FormArray([this.createTechForm()]),
      juridicalPerson: new FormControl('', Validators.required)
    });
    this.rating3 = 0;

    this.formRating = this.fb.group({
      rating1: ['', Validators.required],
      // @ts-ignore
      rating2: [this.sumRating]
    });
  }

  ngOnInit(): void {
    this.techList = this.form.get('technique') as FormArray;
    this.photoSub = this.cabinetService.getCabinetData(this.email).subscribe(data => {
      this.reviews = data.reviews;
      this.ratings = data.ratings;
      this.ratings.forEach(value => {
        this.sumRating = value.sumRating;
        this.form.value.rating2 = value.sumRating;
      })
      this.addDataOnForm(data);
      this.isNew = false;
    });
    this.handlePageChange();
  }

  onSubmit() {
    const userEmail = this.userService.getUserDataFromLocal();
    const cabinet = {
      email: userEmail,
      fio: this.form.value.fio,
      age: this.form.value.age,
      gender: this.form.value.gender,
      technique: this.techList.value,
      juridicalPerson: this.form.value.juridicalPerson,
      avatar: this.file
    };
    if (this.form.value.fio) {
      this.cabinetService.updateCabinetData(cabinet, this.file)
        .subscribe(() => {
          this.warningService.sendWarning('Данные успешно обновлены');
        }, err => {
          console.log(err);
          this.warningService.sendWarning('Ошибка обновления данных')
        });
    } else {
      this.cabinetService.createCabinetData(cabinet, this.file)
        .subscribe(() => {
          this.warningService.sendWarning('Данные успешно сохранены');
        }, err => {
          console.log(err);
          this.warningService.sendWarning('Ошибка создания данных');
        });
    }
  }

  get f() {
    return this.form.controls;
  }

  onImageLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.file = file;
    this.form.patchValue({avatar: file});
    this.form.get('avatar')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    }
    reader.readAsDataURL(file);
  }

  changeBorderStyle() {
    this.flag = !this.flag;
    this.borderState = this.flag ? 'end' : 'start';

  }

  addDataOnForm(data: any) {
    // @ts-ignore
    this.form.get('fio').setValue(data.fio);
    // @ts-ignore
    this.form.get('fio').touched = true;
    // @ts-ignore
    this.form.get('age').setValue(data.age);
    // @ts-ignore
    this.form.get('gender').setValue(data.gender);
    const array = Object.keys(JSON.parse(data.technique));
    for (let i = 0; i < array.length - 1; i++) {
      this.addTechnique();
    }
// @ts-ignore
    this.form.get('technique').setValue(JSON.parse(data.technique));
    this.imagePreview = data.avatar || 'uploads/avatar.jpg';
    // @ts-ignore
    this.form.get('juridicalPerson').setValue(data.juridicalPerson);
  }

  createTechForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(),
      license: new FormControl()
    });
  }

  addTechnique() {
    this.techList.push(this.createTechForm());
  }

  removeTechnique(index: any) {
    this.techList.removeAt(index);
  }

  private getMyPhoto() {
    this.cabinetService.getPhotoByUserEmail(this.email, this.pageSize, this.countPage).subscribe(data => {
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
    })
  }


  ngOnDestroy(): void {
    this.photoSub.unsubscribe();
  }

  handlePageChange() {
    this.getMyPhoto();
    this.countPage += 1;
    console.log('Объект юсер фото', this.userPhotos);
    console.log('Количество страниц', this.countPage);
  }

  // handlePageSizeChange(event: Event) {
  //   // @ts-ignore
  //   this.itemsPerPage = event.target.value;
  //   this.page = 1;
  //   this.getMyPhoto();
  // }
}
