import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterComponent} from './register/register.component';
import {SharedModule} from "./shared/shared.module";
import {CabinetComponent} from "./site-pages/cabinet/cabinet.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {AuthGuard} from "./shared/classes/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import { UsersComponent } from './admin/users/users.component';
import { FilterComponent } from './admin/users/filter/filter.component';
import { TableRowComponent } from './admin/users/table-row/table-row.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterComponent,
    CabinetComponent,
    UsersComponent,
    FilterComponent,
    TableRowComponent
  ],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    CommonModule,
    SharedModule,
    MatTableModule,
    MatSortModule
  ],
  exports: [],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
