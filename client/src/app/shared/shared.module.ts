import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./layouts/site-layout/header/header.component";
import {TopMenuComponent} from "./layouts/site-layout/top-menu/top-menu.component";
import {FooterComponent} from "./layouts/site-layout/footer/footer.component";

@NgModule({
  declarations: [
    HeaderComponent,
    TopMenuComponent,
    FooterComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    HeaderComponent,
    TopMenuComponent,
    FooterComponent
  ]
})
export class SharedModule {
}
