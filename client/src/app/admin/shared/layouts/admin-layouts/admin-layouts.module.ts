import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminLayoutsRoutingModule} from './admin-layouts-routing.module';
import {AdminLayoutsComponent} from './admin-layouts.component';
import {AdminComponent} from "../../../admin.component";
import {SharedModule} from "../../../../shared/shared.module";
import {MatSortModule} from "@angular/material/sort";


@NgModule({
  declarations: [
    AdminLayoutsComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutsRoutingModule,
    SharedModule,
    MatSortModule
  ]
})
export class AdminLayoutsModule { }
