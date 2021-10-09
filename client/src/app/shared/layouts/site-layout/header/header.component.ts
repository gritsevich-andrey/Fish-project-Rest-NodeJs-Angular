import {Component, Input, OnInit} from '@angular/core';
import {HeaderNavButton} from "../../../interfaces";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() nav_buttons: Array<HeaderNavButton> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
