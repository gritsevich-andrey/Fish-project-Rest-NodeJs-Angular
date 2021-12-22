import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
@Input() reviews: any[]=[];
  @Input() ratings: any[]=[];
  @Input() sumRating: number = 0;
  valueRadio = '';
  idS = '100';
  constructor() {
    console.log('Объект рейтинга', this.ratings);
  }

  ngOnInit(): void {
    const ratings = this.ratings;
    console.log('сумма рейтинга', ratings);
  // let sum =  this.ratings.reduce((previousValue, currentValue) => {
  //     return previousValue + currentValue/2;
  //   }, 0);
  // console.log('сумма рейтинга', sum);
  }

  sumRatings(event: any) {
    console.log('Эвент', event);
  }
}
