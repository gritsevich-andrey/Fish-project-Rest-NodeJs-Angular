import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../shared/services/user.service";

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
    form!: FormGroup;
    hide = true;
    imagePreview: string = '';
    borderState = 'end';
    flag: boolean = false;

    constructor(private warningService: WarningService,
                private userService: UserService) {
        this.form = new FormGroup({
            fio: new FormControl('', Validators.required),
            avatar: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
            gender: new FormControl('', Validators.required),
            age: new FormControl('', Validators.required),
            technique: new FormArray([
                new FormControl('', Validators.required)
            ]),
            juridicalPerson: new FormControl('', Validators.required)
        })
    }

    ngOnInit(): void {
        const email = this.userService.getUserDataFromLocal();
       this.userService.getCabinetData(email).subscribe(data => {
           this.form.value.fio = data.fio,
           this.form.value.gender = data.gender,
           this.form.value.age = data.age
           console.log(data);
       });
       console.log(this.form.value);
    }


    onSubmit() {
        const userEmail = this.userService.getUserDataFromLocal();
        const cabinet = {
            email: userEmail,
            fio: this.form.value.fio,
            age: this.form.value.age,
            gender: this.form.value.gender,
            juridicalPerson: this.form.value.juridicalPerson,
            avatar: this.form.value.avatar
        };
        this.userService.createCabinetData(cabinet)
            .subscribe(data => {console.log(data)}, err => console.log(err));
    }

    get f() {
        return this.form.controls;
    }

    getFormsControls(): FormArray {
        return this.form.controls['technique'] as FormArray;
    }

    addTechnique() {
        (<FormArray>this.form.controls["technique"]).push(new FormControl('', Validators.required));
    }

    removeTechnique() {
        (<FormArray>this.form.controls["technique"]).removeAt(-1);
    }

    onImageLoad(event: Event) {
        // @ts-ignore
        const file = (event.target as HTMLInputElement).files[0];
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
}
