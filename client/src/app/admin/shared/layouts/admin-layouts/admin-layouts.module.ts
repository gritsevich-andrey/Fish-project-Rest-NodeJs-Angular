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


@NgModule({
  declarations: [
    AdminLayoutsComponent,
    UsersComponent,
    PhotosComponent,
    SearchFilterPipe
  ],
    imports: [
        CommonModule,
        AdminLayoutsRoutingModule,
        SharedModule,
        MatSortModule,
        MatTableModule,
        NgxPaginationModule,
        NgImageSliderModule,
    ],
  exports: [
    SearchFilterPipe
  ]
})
export class AdminLayoutsModule { }
