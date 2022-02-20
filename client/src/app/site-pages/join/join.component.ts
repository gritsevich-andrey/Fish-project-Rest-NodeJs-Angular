import {Component, OnInit} from '@angular/core';
import {CabinetService} from "../cabinet/cabinet.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import * as CryptoJS from 'crypto-js';
import {WarningService} from "../../shared/services/warning.service";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  isOwnTravel = false
  organizerEmail = '';
  userEmail = '';
  travelId = '';
  user: any[] = [];
  technique: any[] = [];
  ratings: any[] = [];
  reviews: any[] = [];

  constructor(
    private cabinetService: CabinetService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private warningService: WarningService,
    private userService: UserService
  ) {
    this.route.params.subscribe(params => {
      const pass = this.authService.getToken();
      const data = CryptoJS.AES.decrypt(params.email, pass).toString(CryptoJS.enc.Utf8);
      const dataSplitArray = data.split('/');
      this.organizerEmail = dataSplitArray[0];
      this.travelId = dataSplitArray[1];
      this.userEmail = dataSplitArray[2];
      if (this.organizerEmail === this.userEmail) {
        this.warningService.sendWarning('Вы не можете присоединиться к своей поездке');
        // setTimeout(() => {
        //   window.close();
        // }, 2000)
        this.isOwnTravel = true
      }
    });
  }

  ngOnInit(): void {
    this.cabinetService.getCabinetData(this.organizerEmail).subscribe(data => {
      // @ts-ignore
      this.technique = JSON.parse(data.technique);
      this.ratings = data.ratings;
      this.reviews = data.reviews;
      console.log('Данные кабинета', data);
      this.user.push(data);
    });
  }

  goTravel() {
    const pass = this.authService.getToken();
    const data = `${this.userEmail}/${this.travelId}`
    const dataCrypt = CryptoJS.AES.encrypt(data, pass).toString();
    this.router.navigate(['/travel', dataCrypt]);
  }
}
