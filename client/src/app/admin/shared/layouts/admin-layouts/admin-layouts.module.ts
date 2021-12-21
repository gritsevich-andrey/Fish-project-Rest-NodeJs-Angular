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
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DeleteDialogComponent} from "../../../travels/delete-dialog/delete-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    AdminLayoutsComponent,
    UsersComponent,
    PhotosComponent,
    ReviewsComponent,
    AverageRatingComponent,
    ReviewsListComponent,
    PhotosComponent,
    TravelsComponent,
    DeleteDialogComponent
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
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    SearchFilterPipe
  ],
  providers: [EmitterService]
})
export class AdminLayoutsModule { }
