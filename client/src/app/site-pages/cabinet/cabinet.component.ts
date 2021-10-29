import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../shared/services/user.service";
import {CabinetService} from "./cabinet.service";
import {Photo} from "../../shared/interfaces";
import {SortService} from "../../shared/services/sort.service";
import {PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-cabinet',
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss'],
    animations: [
        trigger('borderForm', [
            state('start', style({background: 'red'})),
            state('end', style({background: '#757575'})),
            transition('start => end', animate('0.3s')),
        ]),
    ]
})
export class CabinetComponent implements OnInit, OnDestroy {
    //@ts-ignore
    public techList: FormArray;
    form!: FormGroup;
    hide = true;
    imagePreview = 'uploads/avatar.jpg';
    borderState = 'end';
    flag: boolean = false;
    isNew = true;
    file!: File;
    userPhotos: Photo[]=[];
    totalPhotos = 10;
    photosPerPage = 10;
    pageSizeOptions = [10,20,50,100];
    currentPage = 1;
    //@ts-ignore
@ViewChild('addTech', {static: false}) techRef: ElementRef;
    rating: any;
    rating3: number;
    public formRating: FormGroup;
  private photoSub!: Subscription;
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
            rating2: [4]
        });
    }

    ngOnInit(): void {
        this.techList = this.form.get('technique') as FormArray;
        const email = this.userService.getUserDataFromLocal();
      this.photoSub =  this.cabinetService.getCabinetData(email).subscribe(data => {
            this.addDataOnForm(data);
            this.isNew = false;
        });

      this.getMyPhoto(this.photosPerPage, 1);
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
        if (this.form.value.fio)
        {
            this.cabinetService.updateCabinetData(cabinet, this.file)
                .subscribe(data => {
                    this.warningService.sendWarning('Данные успешно обновлены');
                }, err => {
                    console.log(err);
                    this.warningService.sendWarning('Ошибка обновления данных')});
        } else {
            this.cabinetService.createCabinetData(cabinet, this.file)
                .subscribe(data => {
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
        for (let i=0; i<array.length-1; i++){
            this.addTechnique();
        }
// @ts-ignore
        this.form.get('technique').setValue(JSON.parse(data.technique));
            this.imagePreview = data.avatar;
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

  private getMyPhoto(photosPerPage: number, currentPage: number) {
    this.cabinetService.getPhotoByUserEmail(photosPerPage, currentPage || 1).subscribe(data => {
      const dataStream = data.map((value: any) => {
        this.userPhotos.push(
          {
            userEmail: value.userEmail,
            description: value.description,
            imageSrc: value.imageSrc,
            moderation: value.moderation,
            public: value.public
          });
      })
      this.userPhotos.push(dataStream);
    })
  }

  onChangedPage(pageData: PageEvent) {
      this.currentPage = pageData.pageIndex + 1;
      this.photosPerPage = pageData.pageSize;
this.getMyPhoto(this.photosPerPage, this.currentPage)
  }

  ngOnDestroy(): void {
      this.photoSub.unsubscribe();
  }
}
