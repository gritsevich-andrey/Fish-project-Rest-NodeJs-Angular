import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
@Input() reviews: any[]=[];
  constructor() { }

  ngOnInit(): void {
  console.log('Что принимает компонент отзывы', this.reviews);
  }

}
