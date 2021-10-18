import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layouts',
  templateUrl: './admin-layouts.component.html',
  styleUrls: ['./admin-layouts.component.scss']
})
export class AdminLayoutsComponent implements OnInit {
  top_menu: any[]= [
    {
      title: 'Все пользователи',
      href: 'users'
    },
    {
      title: 'Все путешествия',
      href: '#'
    },
    {
      title: 'Документы пользователей',
      href: '#'
    },
    {
      title: 'Отзывы и рейтинг',
      href: '#'
    },
    {
      title: 'Фото и видео',
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
