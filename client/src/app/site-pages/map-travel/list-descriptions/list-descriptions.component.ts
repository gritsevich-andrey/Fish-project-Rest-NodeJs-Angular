import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";

@Component({
  selector: 'app-list-descriptions',
  templateUrl: './list-descriptions.component.html',
  styleUrls: ['./list-descriptions.component.scss']
})
export class ListDescriptionsComponent implements OnInit {
  //@ts-ignore
@Input() travels: Travel;
  constructor() { }

  ngOnInit(): void {
    console.log(this.travels);
  }

}
