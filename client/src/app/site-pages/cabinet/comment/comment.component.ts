import {Component, Input, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

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
  page = 0;
  pageSize: number = 20;
  // MatPaginator Inputs
  length = 100;
  pageSizeReview = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  //@ts-ignore
  pageEvent: PageEvent;
  constructor() {
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
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
