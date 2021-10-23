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
      href: 'users',
      icon: 'account_box'
    },
    {
      title: 'Все путешествия',
      href: 'travels',
      icon: 'flight'
    },
    {
      title: 'Документы пользователей',
      href: 'documents',
      icon: 'folder_shared'
    },
    {
      title: 'Отзывы и рейтинг',
      href: 'rating',
      icon: 'star'
    },
    {
      title: 'Фото и видео',
      href: 'photos',
      icon: 'insert_photo'
    },
  ]
  footer_links: any[] = [
    {
      title: 'Ссылка 1',
      href: '#!'
    },
    {
      title: 'Ссылка 2',
      href: '#!'
    },
    {
      title: 'Ссылка 3',
      href: '#!'
    },
    {
      title: 'Ссылка 4',
      href: '#!'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
