import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminLayoutsRoutingModule} from './admin-layouts-routing.module';
import {AdminLayoutsComponent} from './admin-layouts.component';
import {AdminComponent} from "../../../admin.component";
import {SharedModule} from "../../../../shared/shared.module";
import {MatSortModule} from "@angular/material/sort";
import {UsersComponent} from "../../../users/users.component";
import {FilterComponent} from "../../../users/filter/filter.component";
import {TableRowComponent} from "../../../users/table-row/table-row.component";
import {MatTableModule} from "@angular/material/table";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    AdminLayoutsComponent,
    AdminComponent,
    UsersComponent,
    FilterComponent,
    TableRowComponent
  ],
    imports: [
        CommonModule,
        AdminLayoutsRoutingModule,
        SharedModule,
        MatSortModule,
        MatTableModule,
        NgxPaginationModule
    ]
})
export class AdminLayoutsModule { }
