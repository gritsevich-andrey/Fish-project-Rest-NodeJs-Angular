import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

declare var M: { FormSelect: { init: (arg0: NodeListOf<Element>) => any; }; }

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html'
})
export class QuestionsComponent implements OnInit {
  form!: FormGroup;

  constructor() {
    this.form = new FormGroup({
      vacationType: new FormControl(''),
      target: new FormControl(''),
      peoplesCount: new FormControl(''),
      costForPeople: new FormControl(''),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.initFormSelect()
  }

  initFormSelect() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  onSubmit() {
    console.log(this.form.value)
  }

}
