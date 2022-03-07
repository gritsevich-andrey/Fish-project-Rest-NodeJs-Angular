import {Component, Input, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() reviews?: any[] = [];
  @Input() ratings: any[] = [];
  @Input() sumRating: number = 0;
  valueRadio = '';
  idS = '100';
  pageReview = 1;
  pageSize: number = 16;

  currentPage: number = 1;
  currentPageReview = 1;
  pageSizeReview = 20;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.reviews)
  }

  sumRatings(event: any) {
    console.log('Эвент', event);
  }
}
