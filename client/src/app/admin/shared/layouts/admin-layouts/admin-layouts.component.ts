import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../shared/services/user.service";
import {WarningService} from "../../../../shared/services/warning.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";

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
      href: 'reviews',
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

  constructor(private userService: UserService,
              private warningService: WarningService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkRole();
  }
  checkRole(): void {
   const role = this.userService.getUserRole();
   let roleAdmin = false;
    for (let roleElement of role) {
      if (roleElement === 'ADMIN')
      {
        roleAdmin = true;
      }
    }
    if(!roleAdmin) {
      this.warningService.sendWarning('Вы не являетесь администратором');
      this.authService.logout();
      this.router.navigate(['login']);
    }
  }
}
