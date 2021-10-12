import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./layouts/site-layout/header/header.component";
import {TopMenuComponent} from "./layouts/site-layout/top-menu/top-menu.component";
import {FooterComponent} from "./layouts/site-layout/footer/footer.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    TopMenuComponent,
    FooterComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
  exports: [
    HeaderComponent,
    TopMenuComponent,
    FooterComponent,
    FormsModule
  ]
})
export class SharedModule {
}
