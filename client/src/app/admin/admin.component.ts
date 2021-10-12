import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  //styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  top_menu: any[]= [
    {
      title: 'Все пользователи',
      href: '#',
      active: true
    },
    {
      title: 'Все путешествия',
      href: '#'
    },
    {
      title: 'Проверка отзывов и рейтинга',
      href: '#'
    },
    {
      title: 'Проверка фото и видео',
      href: '#'
    },
    {
      title: 'Проверка документов пользователей',
      href: '#'
    },
  ]
  header: any[] = [
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
