import { Component, OnInit } from '@angular/core';
import {FooterLink, HeaderNavButton, TopMenuItem} from "../../interfaces";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {
  top_menu: Array<TopMenuItem> = [
    {
      title: 'Живая лента',
      href: '#',
      active: true
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
      href: '#'
    },
    {
      title: 'Чат',
      href: '#'
    },
  ]
  header: Array<HeaderNavButton> = [
    {
      title: 'Вход',
      icon_name: 'account_circle',
      href: '/login'
    },
    {
      title: 'Регистрация',
      icon_name: 'add_circle_outline',
      href: '/register'
    },
  ]
  footer_links: Array<FooterLink> = [
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
