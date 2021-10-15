import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-cabinet',
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {
    form!: FormGroup;

    constructor() {
        this.form = new FormGroup({
            fio: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
            age: new FormControl('', Validators.required),
            technique: new FormArray([new FormControl('', Validators.required)]),
            juridicalPerson: new FormControl('', Validators.required),
            imgSrc: new FormControl('', Validators.required)
        })
    }

    ngOnInit(): void {

    }

    onSubmit() {

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
}
