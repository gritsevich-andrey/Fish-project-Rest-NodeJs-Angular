import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {mimeType} from "./mime-type.validator";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {WarningService} from "../../shared/services/warning.service";

@Component({
    selector: 'app-cabinet',
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {
    form!: FormGroup;
    hide = true;
    imagePreview: string = '';

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
    getFormsControls() : FormArray{
        return this.form.controls['technique'] as FormArray;
    }
    addTechnique(){
        (<FormArray>this.form.controls["technique"]).push(new FormControl('', Validators.required));
    }
    removeTechnique(){
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
}
