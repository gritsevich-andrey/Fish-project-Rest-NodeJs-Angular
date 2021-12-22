import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminLayoutsRoutingModule} from './admin-layouts-routing.module';
import {AdminLayoutsComponent} from './admin-layouts.component';
import {SharedModule} from "../../../../shared/shared.module";
import {MatSortModule} from "@angular/material/sort";
import {UsersComponent} from "../../../users/users.component";
import {MatTableModule} from "@angular/material/table";
import {NgxPaginationModule} from "ngx-pagination";
import {SearchFilterPipe} from "../../../../pipe/search-filter.pipe";
import {PhotosComponent} from "../../../photos/photos/photos.component";
import {NgImageSliderModule} from "ng-image-slider";
import {EmitterService} from "../../../../shared/services/emitter.service";
import {ReviewsComponent} from "../../../reviews/reviews.component";
import {NgxStarRatingModule} from "ngx-star-rating";
import {AverageRatingComponent} from "../../../reviews/average-rating/average-rating.component";
import {ReviewsListComponent} from "../../../reviews/reviews-list/reviews-list.component";
import {TravelsComponent} from "../../../travels/travels.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    AdminLayoutsComponent,
    UsersComponent,
    PhotosComponent,
    ReviewsComponent,
    AverageRatingComponent,
    ReviewsListComponent,
    PhotosComponent,
    TravelsComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutsRoutingModule,
    SharedModule,
    MatSortModule,
    MatTableModule,
    NgxPaginationModule,
    NgImageSliderModule,
    NgxStarRatingModule,
    MatTooltipModule,
    MatDialogModule
  ],
  exports: [
    SearchFilterPipe
  ],
  providers: [EmitterService]
})
export class AdminLayoutsModule { }
