import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {WarningService} from "../../shared/services/warning.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

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

    constructor(private warningService: WarningService) {
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
    }


    onSubmit() {
        this.warningService.sendWarning('Надо отправить на бек', 'Напоминалка');
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
