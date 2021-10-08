import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {
 menu = [
    {name: 'Живая лента', url: '#', icon: 'wifi'},
    {name: 'Отправиться на отдых', url: '#', icon: 'wifi'}
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
