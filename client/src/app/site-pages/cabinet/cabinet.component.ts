import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../shared/services/user.service";
import {CabinetService} from "./cabinet.service";
import {environment} from "../../../environments/environment";

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
export class CabinetComponent implements OnInit {
    //@ts-ignore
    public techList: FormArray;
    form!: FormGroup;
    hide = true;
    imagePreview = '';
    borderState = 'end';
    flag: boolean = false;
    isNew = true;
    file!: File;

    constructor(private warningService: WarningService,
                private cabinetService: CabinetService,
                private userService: UserService) {

        this.form = new FormGroup({
            fio: new FormControl('', Validators.required),
            avatar: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
            gender: new FormControl('', Validators.required),
            age: new FormControl('', Validators.required),
            technique: new FormArray([this.createTechForm()]),
            juridicalPerson: new FormControl('', Validators.required)
        })
    }

    ngOnInit(): void {
        this.techList = this.form.get('technique') as FormArray;
        const email = this.userService.getUserDataFromLocal();
        this.cabinetService.getCabinetData(email).subscribe(data => {
            this.addDataOnForm(data);
            this.isNew = false;
        });

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
        this.cabinetService.createCabinetData(cabinet, this.file)
            .subscribe(data => {
                console.log('Отправка данных на создание кабинета', data)
            }, err => console.log(err));
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
            console.log('Адрес картинки', this.imagePreview);
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
        // @ts-ignore
        // this.form.get('technique').setValue(data.technique);
        // @ts-ignore
        this.imagePreview = environment.backUrl + data.avatar;
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
}
