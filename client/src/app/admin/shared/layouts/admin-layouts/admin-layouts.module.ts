import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminLayoutsRoutingModule} from './admin-layouts-routing.module';
import {AdminLayoutsComponent} from './admin-layouts.component';


@NgModule({
  declarations: [
    AdminLayoutsComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutsRoutingModule
  ]
})
export class AdminLayoutsModule { }
