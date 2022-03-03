import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {UserService} from "../../shared/services/user.service";
import {CabinetService} from "./cabinet.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AskDialogComponent} from "./ask-dialog/ask-dialog.component";

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
  //@ts-ignore
  @ViewChild('addTech', {static: false}) techRef: ElementRef;
  rating: any;
  rating3: number;
  public formRating: FormGroup;
  private photoSub!: Subscription;
  page = 0;
  pageSize: number = 5;
  email = '';
  countPage = 1;
  reviews?: any[] = [];
  ratings: any[] = [];
  viewRating = {
    sumRating: 0,
    star: ''
  }

  urFlag = false;

  constructor(private warningService: WarningService,
              private cabinetService: CabinetService,
              private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog) {

    this.form = new FormGroup({
      fio: new FormControl('', Validators.required),
      avatar: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      gender: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      technique: new FormArray([this.createTechForm()]),
      juridicalPerson: new FormControl('', Validators.required),
      organizationName: new FormControl(''),
      inn: new FormControl(''),
      kpp: new FormControl(''),
    });
    this.rating3 = 0;

    this.formRating = this.fb.group({
      rating1: ['', Validators.required],
      // @ts-ignore
      rating2: [this.sumRating]
    });
  }

  ngOnInit(): void {
    this.email = this.userService.getUserDataFromLocal();
    this.createForm();
    this.handlePageChange();
  }

  private createForm() {
    this.techList = this.form.get('technique') as FormArray;
    this.photoSub = this.cabinetService.getCabinetData(this.email).subscribe(data => {
      let splitReviews: {
        date: any; userEmail: string;
        travelName: any;
        reviewText: any;
        userFIO: string;
      }[] = [];
      if (data) {
        this.urFlag = data.juridicalPerson === 'Юридическое лицо'
        this.form.controls.organizationName.setValue(data.organizationName)
        this.form.controls.inn.setValue(data.inn)
        this.form.controls.kpp.setValue(data.kpp)

        data.reviews.map(value => {
          const array = value.userEmail.split('@');
          const splitReview = {
            //@ts-ignore
            date: value.date,
            userEmail: array[0],
            //@ts-ignore
            travelName: value.travelName,
            //@ts-ignore
            reviewText: value.reviewText,
            //@ts-ignore
            userFIO: value.userFIO
          }
          splitReviews.push(splitReview);
        });
        this.reviews = splitReviews;
        this.ratings = data.ratings;
        this.ratings.forEach(value => {
          if (this.viewRating.sumRating === 0) {
            this.viewRating.sumRating = value.sumValue;
          } else {
            this.viewRating.sumRating = parseFloat(((this.viewRating.sumRating + value.sumValue)/2).toFixed(1));
          }
          this.form.value.rating2 = value.sumRating;
        });
        for (let i =0; i< Math.round(this.viewRating.sumRating); i++) {
          this.viewRating.star += `★`
        }
        this.addDataOnForm(data);
        this.isNew = false;
      }
    });
  }

  onSubmit() {
    const userEmail = this.userService.getUserDataFromLocal();
    const cabinet = {
      email: userEmail,
      fio: this.form.value.fio,
      age: this.form.value.age,
      organizationName: this.form.value.organizationName,
      inn: this.form.value.inn,
      kpp: this.form.value.kpp,
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
          console.error(err);
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
    if(data.fio === 'undefined')
    {
      // @ts-ignore
      this.form.get('fio').setValue('Не указано');
    }
    else {
      // @ts-ignore
      this.form.get('fio').setValue(data.fio);
    }

    if(data.age === 'undefined')
    {
      // @ts-ignore
      this.form.get('age').setValue('Не указан');
    }
    else {
      // @ts-ignore
      this.form.get('age').setValue(data.age);
    }



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

  removeTechnique(index: number) {
   const dialogRef = this.dialog.open(AskDialogComponent);
    dialogRef.afterClosed()
      .subscribe(data => {
        if(data === 'yes') {
          this.techList.removeAt(index);
        }
      });
    if(index === 0) {
      this.addTechnique();
    }

  }


  ngOnDestroy(): void {
    this.photoSub.unsubscribe();
  }

  handlePageChange() {
    // this.getMyPhoto();
    this.countPage += 1;
  }
  splitEmail(email: string) {
    const splitEmail = email.split('@');
    return splitEmail[0];
  }
}
