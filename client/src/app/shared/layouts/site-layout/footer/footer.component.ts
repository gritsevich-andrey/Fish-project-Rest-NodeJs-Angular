import {Component, Input, OnInit} from '@angular/core';
import {FooterLink} from "../../../interfaces";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() links: Array<FooterLink> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
