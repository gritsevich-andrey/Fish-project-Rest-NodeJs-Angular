import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./layouts/site-layout/header/header.component";
import {TopMenuComponent} from "./layouts/site-layout/top-menu/top-menu.component";
import {FooterComponent} from "./layouts/site-layout/footer/footer.component";
import {RouterModule} from "@angular/router";
import { DuplicatePipe } from './pipes/duplicate.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    TopMenuComponent,
    FooterComponent,
    DuplicatePipe
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
        FormsModule,
        DuplicatePipe
    ]
})
export class SharedModule {
}
