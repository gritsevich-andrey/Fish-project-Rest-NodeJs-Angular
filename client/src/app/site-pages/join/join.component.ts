import {Component, OnInit} from '@angular/core';
import {CabinetService} from "../cabinet/cabinet.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  email = '';
  user: any[] = [];
  technique: any[] = [];
  ratings: any[] = [];
  reviews: any[] = [];

  constructor(private cabinetService: CabinetService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.email = params.email);
  }

  ngOnInit(): void {
    console.log(this.email);
    this.cabinetService.getCabinetData(this.email).subscribe(data => {
      // @ts-ignore
      this.technique = JSON.parse(data.technique);
      this.ratings = data.ratings;
      this.reviews = data.reviews;
      this.user.push(data);
    });
  }

}
