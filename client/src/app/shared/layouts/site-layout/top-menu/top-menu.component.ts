import {Component, Input, OnInit} from '@angular/core';
import {TopMenuItem} from "../../../interfaces";

declare var M: { Sidenav: { init: (arg0: NodeListOf<Element>) => any; }; }

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  @Input() menu: Array<TopMenuItem> = [];

  constructor() {
  }

  ngOnInit(): void {
    this.showSidebarMobileMenu();
  }

  showSidebarMobileMenu() {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }
}
