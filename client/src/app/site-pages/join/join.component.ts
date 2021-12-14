import {Component, OnInit} from '@angular/core';
import {CabinetService} from "../cabinet/cabinet.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  organizerEmail = '';
  userEmail = '';
  travelId = '';
  user: any[] = [];
  technique: any[] = [];
  ratings: any[] = [];
  reviews: any[] = [];

  constructor(private cabinetService: CabinetService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    this.route.params.subscribe(params => {
      // this.email = params.email
      const pass = this.authService.getToken();
      const data = CryptoJS.AES.decrypt(params.email, pass).toString(CryptoJS.enc.Utf8);
const dataSplitArray = data.split('/');
this.organizerEmail = dataSplitArray[0];
this.travelId = dataSplitArray[1];
this.userEmail = dataSplitArray[2];
    });
  }

  ngOnInit(): void {
    this.cabinetService.getCabinetData(this.organizerEmail).subscribe(data => {
      // @ts-ignore
      this.technique = JSON.parse(data.technique);
      this.ratings = data.ratings;
      this.reviews = data.reviews;
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
