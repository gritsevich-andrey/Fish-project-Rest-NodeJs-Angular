import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  footer_links = [
    {
      title: 'Карта путешествий',
      href: 'map-travel',
      icon: 'beach_access'
    },
    {
      title: 'Мои поездки',
      href: 'travel',
      icon: 'flight'
    },
    {
      title: 'Личный кабинет',
      href: 'cabinet',
      icon: 'contacts'
    },
    {
      title: 'Чат',
      href: 'chat',
      icon: 'chat'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
