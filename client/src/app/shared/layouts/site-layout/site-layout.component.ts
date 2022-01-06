import { Component } from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html'
})

export class SiteLayoutComponent {
  top_menu: any[]= [
    {
      title: 'Живая лента',
      href: 'feed',
      icon: 'feed'
    },
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
    },
  ]
  footer_links: any[] = [
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

}
