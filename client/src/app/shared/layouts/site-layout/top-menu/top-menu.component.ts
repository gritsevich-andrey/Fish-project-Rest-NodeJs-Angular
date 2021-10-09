import {Component, Input, OnInit} from '@angular/core';
import {TopMenuItem} from "../../../interfaces";

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  @Input() menu: Array<TopMenuItem> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
