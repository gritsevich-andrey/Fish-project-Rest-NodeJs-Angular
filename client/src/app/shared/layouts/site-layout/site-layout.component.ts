import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})

export class SiteLayoutComponent implements OnInit {
  top_menu: any[]= [
    {
      title: 'Живая лента',
      href: '#'
    },
    {
      title: 'Отправиться на отдых',
      href: '#'
    },
    {
      title: 'Предложить место отдыха',
      href: '#'
    },
    {
      title: 'Личный кабинет',
      href: 'cabinet'
    },
    {
      title: 'Чат',
      href: '#'
    },
  ]
  footer_links: any[] = [
    {
      title: 'Ссылка 1',
      href: '#'
    },
    {
      title: 'Ссылка 2',
      href: '#'
    },
    {
      title: 'Ссылка 3',
      href: '#'
    },
    {
      title: 'Ссылка 4',
      href: '#'
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
